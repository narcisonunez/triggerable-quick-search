# How to use

The way to trigger the quick search modal is by pressing **Ctrl + Shift + s**. This will popup a modal to work with.

## **Steps to setup**

- [ ] Download the source code of the library and put them into your project
- [ ] Add Html Modal into the end of your file before **\</body>** tag
- [ ] Basic Setup configuration
- [ ] Register your triggers

### - Download the source code of the library and put them into your project

Go to the **[repository](https://github.com/geekroot/triggerable-quick-search)** and download the **triggerable-quick-search.css** and **triggerable-quick-search.js** files.

After you have your files downloaded, put them into your project corresponding folders, references the file into their correct place like this:

CSS
```css
<head>
    ...
    <link rel="stylesheet" href="path/to/triggerable-quick-search.css">
</head>
```
JS
```javascript
<body>
    ...
    <script type="text/javascript" src="path/to/triggerable-quick-search.js"></script>
</body>
```

We are done with the first step 
- [x] Download the source code of the library and put them into your project
___
### **Add Html Modal**

Right before of the triggerable-quick-search.js reference in your html, add the following modal code (Don't modify the ids of the elements or their positions)

```html
<body>
    <div class="theme-dark">
        <div class="modal fade" id="quick-search-modal" tabindex="-1" role="dialog" aria-labelledby="quick-search-modal-label" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    
                <div class="modal-header">
                    <h5 class="modal-title" id="quick-search-modal-title">Quick Search</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                        <form action="">
                            <input type="text" class="form-control" id="quickSearchInput" placeholder="Quick Search...">
                        </form>
                        <div id="triggersContainer"></div>  
                        <div id="resultContainer">
                            <hr>
                                <a href="#" id="showAllRecords" style="display: none;">Show all</a>
                                <a href="#" id="createRecord" class="create-record" style="display: none;"></a>
                            <hr>
                            <ul id="resultListContainer"></ul>
                        </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="path/to/triggerable-quick-search.js"></script>
</body>
```
If you notice the **theme-dark** class in the main div of the modal. This give to the modal a specific style to display itself.

Others availables themes are: **theme-dark, theme-light, theme-red, theme-violet**, try it your self.

**We are done with the second step**
- [x] Add Html Modal into the end of your file before **\</body>** tag
___

### **Basic Setup configuration**

To setup the basic configuration of the librery we just need to call 2 methods:

```javascript
<script type="text/javascript">
    triggerableQuickSearch.init('/');
    triggerableQuickSearch.baseUrl('http://your-domain-for-the-api.com');
</script>
```
| Code | Description|
| :-------- | :-------------|
| **triggerableQuickSearch** | The global object off the library.|
| **init('')** | Receive the character to be used as the trigger prefix to invoke and consigure all the basic configurations and events.|
| **baseUrl('')** | Set the base url for all your routes that will be registered.|

Now we are ready to add all our triggers.
- [x] Basic Setup configuration
___

### **Register your triggers**

To register your trigger you will need to add this javascript object as follow (read until the end to learn all the options before you try to do it.)

Imagine this data is coming from the API for an specific book.
```json
{
    "poster": "poster-image-path/image.png",
    "isbn": "00000000001",
    "name": "Clean Code",
    "author": "Robert Cecil Martin",
    "release_date": "2008",
    "pages": 600
}
```
Adding the trigger for books. (Check that all the parameters configuration is based on the json above.)
```javascript
triggerableQuickSearch.add({
    "name": "book", // Specify the name of the trigger. Example: /book
    "codeKey": "isbn", // The code column of the book that identify it in your database. isbn is a key in the book data
    "titleKey": "name", // Specific the field to be used as a title (See the image at the end)
    "urls": {
        "all": "/books", // To fetch the array of books
        "single": "/books/{book}", // The url to an specific book. Note that the {book} MUST match with the trigger name
        "redirect": "/books/all" // To redirect to all the books url in your site
    },
    "subtitle": { // Optional: if is set will show a text as subtitle to the result item view.(See the image at the end) 
        "subtitleKey": "author"
    },
    "image": { // Optional: if is set will show an image to the result item view. (See the image at the end)
        "imageKey": "poster"
    },
    "actionable": { // Optional: if is set will show an Create button to redirect to the form. (See the image at the end)
        "url": "/books/create"
    }
});
```
### **Triggers options**

| Code | Description|
| :-------- | :-------------|
| **name** |Specify the name of the trigger.|
| **codeKey** |The code column of the book that identify it in your database.|
| **titleKey** |Specific the field to be used as a title|
| **urls** | The object with the basics required urls.|
| **urls.all** |Where to fetch the array of data.|
| **urls.single** |The url to an specific resource.|
| **urls.redirect** |To redirect to the url containing the list of (resource) in your site.|
| **subtitle** | Optional: if is set will show a text as subtitle to the result item view.|
| **subtitle.subtitleKey** | The field in the json to be used as a subtitle.|
| **image** | Optional: if is set will show an image to the result item view.|
| **image.imageKey** |The field in the json to be used as image path.|
| **actionable** | Optional: if is set will show an Create button to redirect to the form.|
| **actionable.url** | Where to redirect when the Create button is press.|

![alt Result item list](https://github.com/geekroot/triggerable-quick-search/blob/master/docs/imgs/result-item-view.PNG "Result item list")

The required info about a new trigger is:

```javascript
triggerableQuickSearch.add({
    "name": "book",
    "codeKey": "isbn", 
    "titleKey": "name",
    "urls": {
        "all": "/books",
        "single": "/books/{book}",
        "redirect": "/books/all"
    }
});
```

All the others are optionals and will be showed just if is specified.

We all finish. Congrats. Go ahead and make a great user experience right there.
- [x] Register your triggers

---

### **Availables methods**

| Code | Description|
| :-------- | :-------------|
| **init('')** | Receive the character to be used as the trigger prefix to invoke and consigure all the basic configurations and events.|
| **baseUrl('')** | Set the base url for all your routes that will be registered.|
| **add({})** | Add a new trigger to the list. |
| **set([{}])** | Set all the triggers at once that you want to pass in the array.|
