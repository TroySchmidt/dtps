/**
 * @file DTPS course user list screen
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */


/**
 * Renders the people tab for a class
 * 
 * @param {string} courseID The course ID to render the people tab for
 */
dtps.usersList = function (courseID) {
    //Get class index and set as selected class
    var classNum = dtps.classes.map(course => course.id).indexOf(courseID);
    dtps.selectedClass = classNum;

    //Set people as the selected content
    dtps.selectedContent = "people";
    $("#dtpsTabBar .btn").removeClass("active");
    $("#dtpsTabBar .btn.people").addClass("active");

    //Load class color and things
    dtps.presentClass(classNum);

    //Ensure classes are shown in the sidebar
    dtps.showClasses();

    if (classNum == -1) {
        //Class does not exist
        dtps.error("The selected class doesn't exist", "classNum check failed @ dtps.usersList");
    }

    if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "people")) {
        jQuery(".classContent").html(`<div class="spinner"></div>`);
    }

    //Fetch users list
    dtpsLMS.fetchUsers(dtps.classes[classNum].id).then(function (sections) {
        if ((dtps.selectedClass == classNum) && (dtps.selectedContent == "people")) {
            if (!sections || (sections.length == 0)) {
                //No people in this class? (this shouldn't be possible)
                jQuery(".classContent").html(/*html*/`
                    <div style="cursor: auto;" class="card assignment">
                        <h4>Error</h4>
                        <p>Power+ could not get the list of people in this course</p>
                    </div>
                `);
            } else {
                jQuery(".classContent").html(sections.map(section => (
                    /*html*/`
                        <div class="card">
                            <h5><b>${section.title}</b></h5>
                            ${section.users.map(user => (
                                /*html*/`
                                    <div>
                                        <p>
                                            <img style="width: 30px; border-radius: 50%; vertical-align: middle; margin-right: 5px;" src="${user.photoURL}" />
                                            <a href="${user.url}" style="color: var(--text); vertical-align: middle;">${user.name}</a>
                                        </p>
                                    </div>
                                `
                            )).join("")}
                        </div>
                    `
                )).join(""));
            }
        }
    }).catch(function (err) {
        dtps.error("Couldn't fetch users", "Caught promise rejection @ dtps.usersList", err);
    });
}

//Fluid UI screen definitions
fluid.externalScreens.people = (courseID) => {
    dtps.usersList(courseID);
}

/**
* @typedef {Object} ClassSection
* @description Defines a class section in DTPS
* @property {string} title Name of the section
* @property {string} id Section ID
* @property {User[]} users Students in this section
*/