# API_test_tool
Monitor API and Generate Reports
> Website Link :https://api_test.tanyachuang.site

## Table of content
* [Technique](#Technique)
* [Structure](#structure)
* [Database](#database)
* [Features](#features)
* [Unit Test](#Unit_Test)

## Technique
### Backend
* Node.js
* Express.js
* RESTful API
* MVC

### Frontend
* JavaScript
* HTML
* CSS

### Database
* MySQL

### Cloud Service (AWS)
* EC2
* S3
* RDS

### Network
* HTTPS
* Domain Name System (DNS)
* Nginx

### Unit test
* Mocha

### Version control
* Git
* Github

### Test Account
* Account : Test@test.com
* Password : test
* Sample test api 
```
  Method: GET 
  Protocol: HTTPS
  Domain: tanyachuang.site
  Endpoint: api/1.0/marketing/campaigns
```
---

## Structure
![](https://s3-ap-northeast-1.amazonaws.com/apitest.tanyachuang.site/imgs/structure.png)

---

## Database
![](https://s3-ap-northeast-1.amazonaws.com/apitest.tanyachuang.site/imgs/db.png)

---

## Features
* Send request and get response data, status code, response time, network traffic in real time
![](https://i.imgur.com/1H1G4jA.gif)

* Allow user check variable scenarios by creating customized test cases
![](https://i.imgur.com/n0CjSGC.png)![](https://i.imgur.com/kSFFWZY.png)

* Compare response JSON content and data type to criteria automatically
![](https://i.imgur.com/dI13lFg.gif)
![](https://i.imgur.com/UU2M8PM.gif)

* Monitor API stability by running multiple test cases at the specific time everyday
![](https://i.imgur.com/fRjXVei.png)

* Generate report sorted by test case name, test results or test time and highlight fail test results
![](https://i.imgur.com/9BY56Kz.png)

* Save every test record and display text formatting test results in detail page immediately
![](https://i.imgur.com/yztDKov.png)

* Confirm a user’s signup email address by Nodemailer

---

## Unit_Test

* Test "sortby test time" fail when query as spec name
![](https://i.imgur.com/OndnZLq.png)
![](https://i.imgur.com/jWsH7m0.png)
![](https://i.imgur.com/f5vuj1K.png)
![](https://i.imgur.com/ThsTlSp.png)


