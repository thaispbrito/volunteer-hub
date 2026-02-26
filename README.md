# :globe_with_meridians: ServeSphere 

## :spiral_notepad: Website Description & Functionalities

**ServeSphere** is a volunteer hub designed to connect volunteers with organizations that are creating opportunities for positive social impact. The user can participate as a volunteer, an organization, or both, once logs in.

Each user can create one volunteer profile, which represents their personal volunteering preferences. This profile can be edited at any time to reflect preference changes. In addition, a user may create multiple organization profiles, and organizations can create multiple listings, each representing a volunteering opportunity. This establishes the following relationship reflected in the project schemas using referencing:

* User <-> Volunteer: one-to-one
* User <-> Organization: one-to-many
* Organization <-> Listing: one-to-many

Users can browse all available listings through dedicated page **All Listings**, where opportunities from all organizations are displayed. To help users find relevant opportunities more easily, ServeSphere includes a **Matching Dashboard**.

The matching system works in both directions:

* If the user is a volunteer, the dashboard shows listings that match their profile.
* If the user is an organization, the dashboard displays volunteers who match the organization's listings.

A match occurs when three parameters align:

1. Volunteering Cause
2. Volunteering Model (Remote or In-Person)
3. State (location)

In addition to matching, volunteers can like and comment on listings they are interested in. Organizations can also comment on their own listings and are allowed to moderate comments by deleting volunteer comments on listings they own.

> **Why this platform?** I love volunteering, and I wanted to create a practical, real-world application that supports community engagement and social good by making it esier for volunteers and organizations to find meanignful matches.

## :rocket: Getting started

* Link to planning materials: [Trello](https://trello.com/b/UvrzWVbo/project2)
* Link to access the deployed website: [ServeSphere](https://volunteer-hub-125fb4eb2754.herokuapp.com/)

1. Sign in or Sign up: Create an account and access ServeSphere as a volunteer, an organization, or both.

2. Create a volunteer profile and/or, if applicable, one or more organization profiles with volunteer opportunity listings.

3. Explore Opportunities: Browse all available listings and view personalized matches through the Matching Dashboard.

4. Engage: Like, comment on listings as a volunteer, and manage discussions on listings you own as an organization.

## :framed_picture: Screenshots 

| <h3>Description</h3>       | <h3>Screenshot<h3> |
| :----------------:| :------:   |
| <h3 align="center">Landing Page</h3>     |   <img src="public/images/landing_page.png" width="600">   |
| <h3 align="center">Sign In/SignUp</h3>      |   <img src="public/images/auth_page.png" width="600">   |
| <h3 align="center">Add Volunteer Profile</h3>       |  <img src="public/images/form_page.png" width="600">   |
| <h3 align="center">View All Listings </h3>    |  <img src="public/images/listings_page.png" width="600">   |
| <h3 align="center">View Matching Dashboard </h3>   | <img src="public/images/dashboard.png" width="600"> |
| <h3 align="center">Comment & Favorites Section </h3>   | <img src="public/images/comments_section.png" width="600"> |


## :desktop_computer: Technologies Used

![JavaScript](https://img.shields.io/badge/-JavaScript-05122A?style=flat&logo=javascript)
![HTML5](https://img.shields.io/badge/-HTML5-05122A?style=flat&logo=html5)
![CSS3](https://img.shields.io/badge/-CSS-05122A?style=flat&logo=css3)
![EJS](https://img.shields.io/badge/-EJS-05122A?style=flat&logo=ejs)
![Node](https://img.shields.io/badge/-Node.js-05122A?style=flat&logo=node.js)
![Express](https://img.shields.io/badge/-Express-05122A?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/-MongoDB-05122A?style=flat&logo=mongodb)
![Mongoose](https://img.shields.io/badge/-Mongoose-05122A?style=flat&logo=mongodb)
![Markdown](https://img.shields.io/badge/-Markdown-05122A?style=flat&logo=markdown)
![Git](https://img.shields.io/badge/-Git-05122A?style=flat&logo=git)
![Github](https://img.shields.io/badge/-GitHub-05122A?style=flat&logo=github)
![VSCode](https://img.shields.io/badge/-VS_Code-05122A?style=flat&logo=visualstudio)
![Heroku](https://img.shields.io/badge/-Heroku-05122A?style=flat&logo=heroku)
![Trello](https://img.shields.io/badge/-Trello-05122A?style=flat&logo=trello)

## :books: External Resources

* [Mongoose Documentation](https://mongoosejs.com/docs/)
* [MDN Documentation](https://developer.mozilla.org/en-US/)
* [W3Schools](https://www.w3schools.com/)
* [Unsplash](https://unsplash.com/)
* [Freepik](https://www.freepik.com/icon/domain_4400149) (Logo by SumberRejeki)

## :arrow_right: Next Steps

* Add additional pages, such as a Community Page, where users can interact with each other, and a dedicated page for sharing volunteering stories.
* Integrate an API to populate the city field in forms dynamically.
* Allow users to upload photos directly from their local devices.
* Enhance responsive design to better support different screen sizes and devices.