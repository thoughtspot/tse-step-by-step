# ThoughtSpot Everywhere step-by-step

Welcome to TSE step-by-step, an introduction to ThoughtSpot Everywhere.  This is a self-guided course with related video content.  Each section is broken down into a concrete topic along with instructions on the steps to follow and code examples to let you work on the steps yourself.  

This content is currently being developed with new content coming approximately every two weeks.  The content will also be updated as new functionality is released for TSE.

## Requirements 

This course uses the latest version of ThoughtSpot Cloud (8.0.3) and the visual embed SDK (1.11)

## Resources

For this tutorial you will need the following:

* A modern browser.  Chrome is recommended, but not required.  All examples will use Chrome.  
* Access to ThoughtSpot with TSE enabled.  If you don't have an account, you can create an account at https://try.thoughtspot.cloud/.
* A web server that will host static web content (.html, .css, .js files).  The examples will use Python3's [`http.server`](https://docs.python.org/3/library/http.server.html) module, but you can use Apache, Tomcat, etc.
* A basic understanding of ThoughtSpot.  This can be obtained by taking introductory courses.  See the [ThoughtSpot Training site](https://training.thoughtspot.com) for courses you can take to learn the basics.

Ideally you will have some experience with HTML and Javascript, but it's not required.

## Lessons

| Lesson                                                                    | Description                                                                                                                                                               |
|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Lesson 1 - Introduction to TSE](lesson-01-intro-to-tse/README-01.md)     | This lesson provides an overall introduction to what TSE is and why you would want to use it.                                                                             |
| [Lesson 2 - Setting up for the course](lesson-02-setting-up/README-02.md) | This lesson is all about getting set up and ready to code.  You'll download the code and review the resources and tools that will be used.                                |
| [Lesson 3 - Security Setting](lesson-03-security-setup/README-03.md)      | In this lesson we'll talk about the security settings and considerations you need for embedding.                                                                          |
| [Lesson 4 - Start Coding](lesson-04-start-coding/README-04.md)            | We're ready to start coding.  In this lesson we'll set up the starter code, review the files we're working with and start the web server to verify everything is working. |
| [Lesson 5 - Embed Search](lesson-05-embed-search/README-05.md)            | In this lesson we'll add code to initialize the SDK and embed a search component.                                                                                         |
| [Lesson 6 - Embed Liveboard](lesson-06-embed-liveboard/README-06.md)      | In this lesson we'll add code to to embed a liveboard and a liveboard visualization.                                                                                      |
| [Lesson 7 - Embed Application](lesson-07-embed-full-app/README-07.md)     | Finally, we'll embed the full ThoughtSpot application.                                                                                                                    |
