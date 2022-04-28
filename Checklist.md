# Check list

## Core requirements

- [x] The user should be able to create a new empty box with box name and box description.

- [ ] The user should be able to edit the box name and the description when needed.

- [ ] The user should be able to upload a CSV file into the chosen box.

- [ ] Each box can contain no more than one file.

- [ ] The user should be able to see the list of boxes.

- [ ] The user should be able to view the content of any box: the name, the description and the file name inside the box, if any.

- [ ] The user should be able to «unbox» the file, that is download it from the server or storage.

## Extra requirements

- [ ] the box view UI may contain a subsequent or embedded UI for viewing the content of the CSV file.

- [ ] authentication: the user should be able to log in and log out;

- [ ] authorization: the logged in users become the owners of the boxes they create;

- [ ] authorization: the owned boxes are private by default

- [ ] authorization: the owners may opt to turn their boxes to be public;

- [ ] authorization: public boxes should be visible to any user (regardless their logged status);

- [ ] authorization: the boxes, created by unauthenticated users are public by default;

- [ ] authorization: the user should be able to delete only the boxes that they own (have created);

- [ ] authorization: there may be a user with elevated privileges (superuser), who can delete any regular user and their data;

- [ ] authorization: the users may share their boxes with other specific users by knowing their usernames or emails.

- [ ] a good description of how to run the application in the development mode and how to deploy it to production.

- [ ] cloud-based storage for the CSV files

- [ ] thoughts on the overall application architecture, the security concerns, vision on how to improve and evolve this application in the future
