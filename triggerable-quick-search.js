var triggerableQuickSearch = {
  "theme": "default", // UI theme to be used.
  "triggerPrefix": "", // The character to be used to invoke any trigger registered.
  "triggers": [], // Array containing all the triggers registered.

  /* Object confirutation entry point
  * @param container - Input Element where the user will be typing.
  * @param triggerPrefix - The character to be used to invoke any trigger registered.
  * return undefined
  */
  init: function(triggerPrefix) {
      this.triggerPrefix = triggerPrefix || "@"; // @ Is the default triggerPrfix

      this.bind();
  },

  /* Bind will be binding the input field provided as container to the event "keyup"
  *  This allow us to know when a trigger is found and the action to take
  */
  bind: function(){
      var me = this;

      document.getElementById("quickSearchInput").addEventListener('keyup', function(event){
          var inputText = this.value.split(" ");
          var trigger = inputText[0];
          var queryString = inputText[inputText.length - 1];
          var triggerName = trigger ? trigger.substring(1) : '';

          if (trigger &&
            trigger.startsWith(me.triggerPrefix) &&
            me.invocationTrigger(triggerName) &&
            me.exists(triggerName) &&
            inputText.length == 1
          ) {
              var trigger = me.invocationTrigger(triggerName)[0];

              me.sendRequest(trigger, trigger.urls.all);
              me.showViews();

          }else if(trigger &&
            trigger.startsWith(me.triggerPrefix) &&
            me.invocationTrigger(triggerName) &&
            me.exists(triggerName) &&
            inputText.length != 1){
                console.log("filtrando");
          } 
          else {
            me.resetViews();
          }
      });
  },

  showTriggersOnModal: function(){
    var triggerList = document.getElementById('triggersContainer');
    var triggersHtml = '';
    var me = this;
    this.triggers.forEach(function(trigger){
        triggersHtml += '<span class="trigger-hint">'+ me.triggerPrefix + trigger.name +'</span>';
    });
    triggerList.innerHTML = triggersHtml;

    var triggersList = document.getElementsByClassName('trigger-hint');
    for (var i = 0; i < triggersList.length; i++) {
        triggersList[i].addEventListener('click', function(event){
            document.getElementById("quickSearchInput").value = event.target.innerHTML;
            document.getElementById("quickSearchInput").dispatchEvent(new Event("keyup"));
        });
    }
  },

  /* Check if the trigger passed as parameter exists in the invocationTriggers array
  */
  exists: function(triggerName){
      var triggers = this.triggers.filter(function(trigger){
          return trigger.name == triggerName;
      });

      return triggers.length ? true : false;
  },

  /* Add a new trigger to the invocationTriggers array
  */
  add: function(trigger){
      this.triggers.push(trigger);
  },

  /* Add an array of new triggers to be registered in the invocationTriggers array
  */
  set: function(triggers){
      var me = this;

      triggers.forEach(function(invocationTrigger){
          me.add(invocationTrigger);
      });
  },

  /* Return the trigger passed as parameter if exists, otherwise, return all the triggers
  * @param trigger - The name of an specific trigger to fetch
  */
  invocationTrigger: function(triggerName){
      var me = this;
      if (triggerName) {
        return me.triggers.filter(function(trigger){
            return trigger.name == triggerName;
        });
      }
      return this.triggers;
  },

  /* Check if the trigger exists and return the its urls object
  * @param triggerName
  */
  invocationTriggerUrl: function(triggerName){
      return this.exists(triggerName) ? this.invocationTrigger(triggerName)[0].urls : {};
  },

  sendRequest: function(trigger, url) {
      var me = this;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var items = JSON.parse(this.responseText);
          me.render(trigger, items);
        }
      };

      xhttp.open("GET", url, true);
      xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhttp.send();
  },

  /* Render all the results provided by the urls.all of a trigger urls object
  * @param trigger - the trigger responsable for the action
  * @param items - All the data coming from the request
  * return undefined
  */
  render: function(trigger, items){
    var me = this;
    var resultListElement = document.getElementById('resultListContainer');

    var html = '';

    items.forEach(function(item){
      html = html + me.renderItem(trigger, item);
    });

    resultListElement.innerHTML = html;
    resultListElement.style.display = "block";

    var allRecordsLink = document.getElementById('showAllRecords');
    allRecordsLink.href = trigger.urls.redirect;
    allRecordsLink.style.display = "block";

    me.reloadListeners(trigger);
  },

  /* Render an specific list item result
  * @param trigger - the trigger responsable for the action
  * @param item - The specific data object for a list item result
  * return string
  */
  renderItem: function(trigger, item){
    var image = false;
    if ('image' in trigger){
         image = item[trigger.image.imageKey]
    }

    return this.template()
            .replace("{data}", 'data-title="'+ item[trigger.titleKey] +'" data-code="'+ item[trigger.codeKey] +'"')
            .replace("{hasImage}", image || 'style="display: none;"')
            .replace("{image}", image ?  item[ trigger.image.imageKey ] : '' )
            .replace("{title}", item[trigger.titleKey])
            .replace("{subtitle}", trigger.subtitle ? item[trigger.subtitle.subtitleKey] : '');
  },

  /* the specific item list template to be draw or created for each item in the results
  */
  template: function(){
      return '<li class="quick-search-result item-result" {data}>' +
                '<figure class="result-info-image" {hasImage}>' +
                    '<img src="{image}" alt="" >' +
                '</figure>' +
                '<div class="result-info">' +
                    '<div class="result-info-title">{title}</div>' +
                    '<div class="result-info-subtitle">{subtitle}</div>' +
                '</div>' +
              '</li>';
  },

  reloadListeners: function(trigger){
    var resultList = document.getElementsByClassName('item-result');
    
    var me = this;
    for (var i = 0; i < resultList.length; i++) {
        resultList[i].addEventListener('click', function(event){
            me.onItemListClick(trigger, this);
        });
    }
  },

  onItemListClick: function(trigger, clickedElement){
      var title = clickedElement.dataset.title;
      var code = clickedElement.dataset.code;

      var url = trigger.urls.single.replace("{"+ trigger.name +"}", code);
      window.location.href = url;
  },

  resetViews: function(){
      document.getElementById("resultContainer").style.display = "none";
      document.getElementById("showAllRecords").style.display = "";
      document.getElementById("showAllRecords").href = "#";
      document.getElementById("resultListContainer").innerHTML = "";
  },

  showViews: function(){
    document.getElementById("resultContainer").style.display = "block";
    document.getElementById("showAllRecords").style.display = "block";
}
};
