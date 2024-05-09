# Peer Testing Report

>## System Description
The Woo Woo Network is an online hub that connects healers with clients in need of spiritual healing services. We have developed a dashboard and a new user interface that we would like to implement. The dashboard works like a search function for the user to find other clients, healers, appointments, transactions and services information. We are also developing to update the user interface. For this peer-testing, we planned to gain some user feedback before we actually implement those interfaces.


>## Participant Details
Administrator|Participant|Session Status|Evaluation Type|Link To video: <br />
--- | --- | --- | --- |--- |
Gerald Promchuakaew |Sophia Joseph |Completed |User Feedback |https://drive.google.com/file/d/1tRlJvEwuzwt_kL_uneBH5QVKIfP3iYXP/view?usp=sharing 
Gerald Promchuakaew |Hassan Brar|Completed|Think Aloud|https://drive.google.com/file/d/1Fzx65BFttbtrQzWzSTJ7cDOii6JpZW7R/view?usp=sharing 
Cody Tyerman  |Daven Minhas|Completed|User Feedback|https://drive.google.com/file/d/11yuaZyJqEyRX-3bcJGCLQ30XcbXfFBMM/view?usp=sharing
Cody Tyerman|Hassan Brar|Completed|Think Aloud|https://drive.google.com/file/d/19zHOOnvOeax6PPWmWSyWDygaCWgBmA7J/view?usp=sharing
Cassie Peters|Daven Minhas|Completed|User Feedback|https://drive.google.com/file/d/1Nm1bSddyV9HrZ7MawwewbpNawXZk7QeP/view?usp=sharing
Cassie Peters|Andrew Kiggins|Completed|Think Aloud |https://drive.google.com/file/d/10b46aMCeIDWPTppwWB8Dr1pWlUNdEEkj/view?usp=sharing
Jason Hsiao|Jesse Plamondon|Completed|User Feedback|https://drive.google.com/file/d/137SEOy5yLTZOeAM9_tbVBdXADhjlWSLG/view?usp=sharing
Jason Hsiao|Reid Folk|Completed|Think Aloud|https://drive.google.com/file/d/1FVu9cxzkI05hLxS8mJvKeQ_-zSJ5lzXn/view?usp=sharing

># User Groups and Associated Tasks 
>##  User Group: Administrators
> Tested Feature: The Administrator Dashboard
 - Open the dashboard project (should already be done)
 - Navigate to the client page by clicking the client tab on the top left of the page
- Click on the dropdown menu directly below the client tab and select “Client ID” to change the search option
Type “2” into the search bar to retrieve the client with the client id of 2
- Click on the dropdown menu another time and select “Full Name”  to change the search option
- Type “Jill Joe” into the search bar to retrieve the client with the full name of Jill Joe
- Click on the result in the table and then click the disable button to disable this client
- Click on the one client again and then click the enable button to enable this client
- Empty the search bar and click “Search”
- You should see a list of all 4 clients in the database
- Select all 4 clients by clicking on all of them
- Click on the clear button to deselect all the clients
- Navigate to the healer page by clicking “Healer” tab on the top of the page
- Notice all the healers that show up initially in the table
- Disable the healers with the Healer ID’s of 3 and 4 by selecting both of them and clicking on the disable button
- Leaving the search bar empty, click on the dropdown menu that says “Enabled” and change it to “Disabled”
- Now you should only see healers with Healer ID’s of 3 and 4 from before
- Revert your changes by clicking on these two healers and selected the enable button
- Now that you are more familiar with the basics of the dashboard, browse through the remaining tabs and try performing your own searches

>User Group: Clients
>#Tested Feature: The Signup/Login Process
- Open the WooWooNetwork project home page (should already be done)
- Scroll down the page and take a look at the list of healers
- Return to the top of the page and click on the sign up tab
- Enter in some dummy data since the website is currently unsecure and make sure to keep the “Are you a healer?” option unselected
- Now click on the login tab on the top right of the page
- This often doesn’t work so we’re interested to see what happens when other people try themselves
- For the case that it didn’t work, what kind of problems do you see?
- Otherwise, proceed to take a look around the authorized version of the site and log out when you feel you have seen everything
- UX Evaluation: Clients
- Tested Feature: Web Application
- On the landing page Register for the site by clicking the button that you think will allow you to do so
- Register for the site 
- What information would you not want to provide? 
- What information do you think should be optional? 
- Would you register using social accounts on the site if given the option instead? 
- Now that you’re registered as a user login to the site
- Find all healers in kelowna
- Select a kelowna healer like “Charley Roy”
- Send Charlie Roy a direct message asking about a service they have listed
- Select a service of Charlie’s
- Find the price and the rating of the selected service 
- Find the reviews of the selected service
- Book an appointment for January 19th at 10am
- Select a payment method

>UX Evaluation: Healers
>#Tested Feature: Web Application
- On the landing page Register for the site as a prospective healer by clicking the button that you think will allow you to do so
- Is the path to registering intuitive? 
- Register for the site as a healer
- What information would you not want to provide as a healer? 
- Would you be willing to provide geographic data on the location of your practice? 
- What information do you think should be optional and what information is potentially missing? 
- Now that you’re registered as a healer login to the site
- Upload your first service 
- Navigate to the Service Page
- Do you like the layout? 
- Based on this page what information do you think you need to provide to post a service? 


>## Results Bar Graph
1. The system design has good visibility of system status.
    - The header and footers of the site show everything an end user needs to see without being overcrowded or messy. Each site page also has a minimalist design that test users said was an efficient use of space and very intuitive to use. However, some icons were a bit small and could use some resizing and relocating. One test user suggested we also hold off on overloading some pages with features like rating stars on healer’s registration page.

2. The design follows real-world conventions, making information appear in a natural and logical order.
    - The front end of the site has a good branding with a head in an intuitive position, a search bar that makes sense and other features that fall in line with typical web conventions making the experience intuitive for end users. That being said there are a handful of design choices like the back button that should be rethought or removed entirely. 

3. The design is consistent with other platform and industry conventions.
    - Most users found the UX design of the platform to be an intuitive experience that fell in-line with real-world conventions. Pages flowed in a natural and logical order with the one exception being that some users felt that logging in before browsing healers was a hindrance and a potential deterrent. 

4. The design offers user control and freedom for users to do their actions and avoid getting frustrated.
    - The majority of users found that the design offers user control and freedom. However, a sizable portion had problems with getting the drop downs to work as expected. Therefore, they ended up getting quite frustrated when they could not get the system to do precisely what they wanted, like when filtering by enabled and disabled users.

5. The system has good user feedback
    - Overall, users were mixed on the user feedback of the dashboard and UI/UX document. The main concern is that, after making a query, the whole page had to reload. Autofill is another feature that is sorely missing and was requested multiple times.

6. The system offers interfaces that promote recognition to reduce the amount of cognitive effort required from users.
    - All the users found that our design promotes recognition to reduce the amount of cognitive effort required from users. This is due to our filter or sorting system that makes it a lot easier for users to find what they are looking for. We also have a search bar and region location to help users navigate more efficiently.

7. The website is efficient and is designed to be flexible for both experienced and inexperienced users.
    - During the testing sessions the users mostly did not have issues with the login, register and other functions on the websites. They also navigated the websites freely and when they went over the more general tasks like browse through the remaining tabs and do their own search.

8. The design of the website is aesthetically pleasing and easy to look at.
    - The vast majority of users thought that the website’s design is aesthetically pleasing. They liked the colour scheme. There were some complaints about the alignment of views on certain forms. The main thing we need to do is restructure how the information is presented to the users.

9. When an error occurs, the system precisely indicates the problem and suggests a solution.
    - We got a relatively low grade on this question. In the sessions, we were mostly trying to tell the user verbally how to fix that if we have encountered the issues before. If we have not had the same issue before we would not be able to teach or have our system tell the users how to fix them.

10. When there is a problem with the system, there is a document that provides an explanation to help users understand how to   complete their tasks.
    - For the peer testing sessions, our main goal was to test our features and find new errors. Therefore, there were times that our systems could not tell the users how to fix it, but all the issues were recorded and will be fixed.




