/**
 * @file DTPS assignment functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */
dtps.renderAssignment=function(assignment){var scoreHTML=dtps.renderAssignmentScore(assignment);var HTML=`\n        <div \n            onclick="${`dtps.assignment('`+assignment.id+`', `+assignment.class+`)`}" \n            class="card ${scoreHTML?"graded assignment":"assignment"}"\n            style="${"--classColor: "+dtps.classes[assignment.class].color}"\n        >\n\n            \x3c!-- Color bar for the dashboard --\x3e\n            <div class="colorBar"></div>\n\n            \x3c!-- Assignment title and points --\x3e\n            <h4>\n                <span>${assignment.title}</span>\n\n                \x3c!-- Points display --\x3e\n                ${scoreHTML?`<div class="points">${scoreHTML}</div>`:``}\n            </h4>\n\n            <h5 style="white-space: nowrap; overflow: hidden;">\n                \x3c!-- Assignment info --\x3e\n                ${assignment.dueAt?`<div class="infoChip"><i style="margin-top: -2px;" class="material-icons">alarm</i> Due `+dtps.formatDate(assignment.dueAt)+`</div>`:""}\n                ${assignment.outcomes?`<div class="infoChip weighted"><i class="material-icons">adjust</i>`+assignment.outcomes.length+`</div>`:""}\n                ${assignment.category?`<div class="infoChip weighted"><i class="material-icons">category</i> `+assignment.category+`</div>`:""}\n\n                \x3c!-- Status icons --\x3e\n                ${assignment.turnedIn?`<i title="Assignment submitted" class="material-icons statusIcon" style="color: #0bb75b;">assignment_turned_in</i>`:``}\n                ${assignment.missing?`<i title="Assignment is missing" class="material-icons statusIcon" style="color: #c44848;">remove_circle_outline</i>`:``}\n                ${assignment.late?`<i title="Assignment is late" class="material-icons statusIcon" style="color: #c44848;">assignment_late</i>`:``}\n                ${assignment.locked?`<i title="Assignment submissions are locked" class="material-icons statusIcon" style="font-family: 'Material Icons Extended'; color: var(--secText, gray);">lock_outline</i>`:``}\n                ${assignment.pending?`<i title="Grade is pending review" class="material-icons statusIcon" style="color: #b3b70b;">rate_review</i>`:``}\n            </h5>\n        </div>\n    `;return HTML};dtps.renderAssignmentScore=function(assignment){var scoreHTML="";if(dtpsLMS.useRubricGrades&&assignment.rubric){var rubricHTML=[];assignment.rubric.forEach(rubricItem=>{if(rubricItem.score){rubricHTML.push(`\n                    <div title="${rubricItem.title}" style="color: ${rubricItem.color||"var(--text)"};">\n                        ${rubricItem.score}\n                    </div>\n                `)}});if(rubricHTML.length)scoreHTML=`<div class="dtpsRubricScore">${rubricHTML.join("")}</div>`}else if(!dtpsLMS.useRubricGrades&&(assignment.grade||assignment.grade==0)){scoreHTML=`\n            <div class="assignmentGrade">\n                <div class="grade">${assignment.grade}</div>\n                <div class="value">/${assignment.value}</div>\n                ${assignment.letter?`<div class="letter">${assignment.letter.replace("incomplete",`<i class="material-icons">cancel</i>`).replace("complete",`<i class="material-icons">done</i>`)}</div>`:""}\n                <div class="percentage">${Math.round(assignment.grade/assignment.value*100)}%</div>\n            </div>\n        `}return scoreHTML};dtps.masterStream=function(){dtps.presentClass("dash");dtps.showClasses();$("#dtpsTabBar .btn").removeClass("active");var ready=0;dtps.classes.forEach(course=>{if(course.assignments)ready++});var doneLoading=ready==dtps.classes.length;function dashboardContainerHTML(dashboardItem){if(dashboardItem.id=="dtps.calendar"){return $.fullCalendar!==undefined?`<div id="calendar" class="card" style="padding: 20px;"></div>`:""}else if(dashboardItem.id=="dtps.updates"){return`<div class="updatesStream recentlyGraded announcements"></div>`}else if(dashboardItem.id=="dtps.dueToday"){return`<div style="padding: 20px 0px;" class="dueToday"></div>`}else if(dashboardItem.id=="dtps.upcoming"){return`<div style="padding: 20px 0px;" class="assignmentStream"></div>`}}if(dtps.selectedClass=="dash"){jQuery(".classContent").html(`\n            <div class="dash cal" style="width: 40%;display: inline-block; vertical-align: top;">\n                ${dtps.leftDashboard.map(dashboardItem=>dashboardContainerHTML(dashboardItem)).join("")}\n            </div>\n\n            <div style="width: 59%; display: inline-block;" class="dash stream">\n                ${!doneLoading?`<div style="margin: 75px 25px 10px 75px;"><div class="spinner"></div></div>`:""}\n                ${dtps.rightDashboard.map(dashboardItem=>dashboardContainerHTML(dashboardItem)).join("")}\n            </div>\n        `)}dtps.renderUpdates();dtps.renderUpcoming(doneLoading);dtps.calendar();dtps.renderDueToday(doneLoading)};dtps.renderDueToday=function(doneLoading){var combinedStream=[];if(dtps.classes){dtps.classes.forEach(course=>{if(course.assignments){course.assignments.forEach(assignment=>{if(dtps.isToday(assignment.dueAt)){combinedStream.push(assignment)}})}})}combinedStream.sort((function(a,b){var keyA=new Date(a.dueAt).getTime(),keyB=new Date(b.dueAt).getTime();if(keyA>keyB)return 1;if(keyA<keyB)return-1;return 0}));var combinedHTML=combinedStream.map(assignment=>dtps.renderAssignment(assignment)).join("");if(combinedStream.length==0){if(doneLoading){combinedHTML=`<p style="text-align: center;margin: 10px 25px 10px 75px; font-size: 18px;"><i class="material-icons">done</i> Nothing due today</p>`}else{combinedHTML=``}}else{combinedHTML=`\n            <h5 style="text-align: center; margin: 10px 25px 10px 75px; font-weight: bold;">Due today</h5>\n        `+combinedHTML}if(dtps.selectedClass=="dash"){jQuery(".classContent .dash .dueToday").html(combinedHTML)}};dtps.renderUpcoming=function(){var combinedStream=[];if(dtps.classes){dtps.classes.forEach(course=>{if(course.assignments){course.assignments.forEach(assignment=>{if(new Date(assignment.dueAt)>new Date&&!dtps.isToday(assignment.dueAt)){combinedStream.push(assignment)}})}})}combinedStream.sort((function(a,b){var keyA=new Date(a.dueAt).getTime(),keyB=new Date(b.dueAt).getTime();if(keyA>keyB)return 1;if(keyA<keyB)return-1;return 0}));var combinedHTML=combinedStream.map(assignment=>dtps.renderAssignment(assignment)).join("");if(combinedStream.length==0){combinedHTML=""}if(dtps.selectedClass=="dash"){jQuery(".classContent .dash .assignmentStream").html(combinedHTML)}};dtps.renderUpdates=function(){var updatesHTML="";dtps.updates.forEach(update=>{if(update.type=="announcement"){updatesHTML+=`\n                <div onclick="$(this).toggleClass('open');" style="cursor: pointer; padding: 20px; --classColor: ${dtps.classes[update.class].color};" class="announcement card">\n                    <div class="className">${update.title}</div>\n                    ${update.body}\n                </div>\n            `}else if(update.type=="assignment"){var scoreHTML=dtps.renderAssignmentScore(update);updatesHTML+=`\n                <div onclick="dtps.assignment('${update.id}', ${update.class})" style="--classColor: ${dtps.classes[update.class].color};" class="card recentGrade">\n                    <h5>\n                        <span>${update.title}</span>\n\n                        \x3c!-- Points display --\x3e\n                        ${scoreHTML?`<div class="points">${scoreHTML}</div>`:``}\n                    </h5>\n\n                    <p>Graded at ${dtps.formatDate(update.gradedAt)}</p>\n                </div>\n            `}});if(dtps.selectedClass=="dash"){jQuery(".classContent .dash .updatesStream").html(updatesHTML)}};dtps.calendar=function(){if(dtps.selectedClass=="dash"){var calEvents=[];dtps.classes.forEach((course,courseIndex)=>{if(course.assignments){course.assignments.forEach(assignment=>{calEvents.push({title:assignment.title,start:moment(new Date(assignment.dueAt)).toISOString(true),allDay:false,color:course.color,classNum:courseIndex,assignmentID:assignment.id})})}});if($.fullCalendar!==undefined){$("#calendar").fullCalendar({events:calEvents,header:{left:"title",right:"prev,next"},eventClick:function(calEvent,jsEvent,view){dtps.assignment(calEvent.assignmentID,calEvent.classNum)},eventAfterAllRender:function(){$(".fc-prev-button").html(`<i class="material-icons">keyboard_arrow_left</i>`);$(".fc-next-button").html(`<i class="material-icons">keyboard_arrow_right</i>`)}})}$(".fc-prev-button").html(`<i class="material-icons">keyboard_arrow_left</i>`);$(".fc-next-button").html(`<i class="material-icons">keyboard_arrow_right</i>`)}};dtps.classStream=function(classID,searchResults,searchText){var classNum=dtps.classes.map(course=>course.id).indexOf(classID);dtps.selectedClass=classNum;dtps.selectedContent="stream";$("#dtpsTabBar .btn").removeClass("active");$("#dtpsTabBar .btn.stream").addClass("active");dtps.presentClass(classNum);dtps.showClasses();if(classNum==-1){dtps.error("The selected class doesn't exist","classNum check failed @ dtps.classStream")}var assignments=searchResults||dtps.classes[classNum].assignments;if(!assignments){if(dtps.selectedClass==classNum&&dtps.selectedContent=="stream"){jQuery(".classContent").html(dtps.renderClassTools(classNum,"stream",searchText)+`<div class="spinner"></div>`)}}else if(assignments.length==0){if(searchText){if(dtps.selectedClass==classNum&&dtps.selectedContent=="stream"){$(".classContent").html(dtps.renderClassTools(classNum,"stream",searchText)+`\n                    <div style="cursor: auto;" class="card assignment">\n                        <h4>No results</h4>\n                        <p>There weren't any search results</p>\n                        <button onclick="fluid.screen()" class="btn"><i class="material-icons">arrow_back</i> Back</button>\n                    </div>\n                `)}}else{if(dtps.selectedClass==classNum&&dtps.selectedContent=="stream"){$(".classContent").html(dtps.renderClassTools(classNum,"stream",searchText)+`<div style="cursor: auto;" class="card assignment"><h4>No assignments</h4><p>There aren't any assignments in this class yet</p></div>`)}}}else{assignments.sort((function(a,b){var keyA=new Date(a.dueAt).getTime(),keyB=new Date(b.dueAt).getTime();var now=(new Date).getTime();if(!a.dueAt){keyA=0}if(!b.dueAt){keyB=0}if(keyA<now||keyB<now){if(keyA<keyB)return 1;if(keyA>keyB)return-1;return 0}else{if(keyA>keyB)return 1;if(keyA<keyB)return-1;return 0}}));var prevAssignment=null;var streamHTML=assignments.map(assignment=>{var divider="";if(!assignment.dueAt){if(prevAssignment&&prevAssignment!=="undated"){divider=`<h5 style="margin: 75px 75px 10px 75px;font-weight: bold;">Undated Assignments</h5>`}prevAssignment="undated"}else if(new Date(assignment.dueAt)<new Date){if(prevAssignment&&prevAssignment!=="old"){divider=`<h5 style="margin: 75px 75px 10px 75px;font-weight: bold;">Old Assignments</h5>`}prevAssignment="old"}else{prevAssignment="upcoming"}return divider+dtps.renderAssignment(assignment)}).join("");streamHTML=dtps.renderClassTools(classNum,"stream",searchText)+streamHTML;if(dtps.selectedClass==classNum&&dtps.selectedContent=="stream"){$(".classContent").html(streamHTML)}}};dtps.assignment=function(id,classNum){var assignmentIDs=dtps.classes[classNum].assignments.map(assignment=>assignment.id);var assignment=dtps.classes[classNum].assignments[assignmentIDs.indexOf(id)];var assignmentBodyURL=null;if(assignment.body){var computedBackgroundColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");var computedTextColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--text");var blob=new Blob([`\n                <base target="_blank" /> \n                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>\n                ${assignment.body}\n            `],{type:"text/html"});assignmentBodyURL=window.URL.createObjectURL(blob)}var assignmentRubricHTML="";if(assignment.rubric){var assignmentRubricHTML=assignment.rubric.map((function(rubricItem){return`\n                    <div class="dtpsAssignmentRubricItem">\n                        <h5>${rubricItem.title}</h5>\n                        <div class="score">\n                            <p style="color: ${rubricItem.color?rubricItem.color:"var(--secText)"};" class="scoreName">\n                                ${rubricItem.score?rubricItem.scoreName||"":"Not assessed"}\n\n                                <div class="points">\n                                    <p class="earned">${rubricItem.score||"-"}</p>\n                                    <p class="possible">${"/"+rubricItem.value}</p>\n                                </div>\n                            </p>\n                        </div>\n                    </div>\n                `})).join("")}var assignmentFeedbackHTML="";if(assignment.feedback){var assignmentFeedbackHTML=assignment.feedback.map(feedback=>`\n                    <div class="dtpsSubmissionComment">\n                        ${feedback.author?`\n                            <img src="${feedback.author.photoURL}" />\n                            <h5>${feedback.author.name}</h5>\n                        `:``}\n\n                        <p>${feedback.comment}</p>\n                    </div>\n                `).join("")}var scoreHTML=dtps.renderAssignmentScore(assignment);$(".card.details").html(`\n            <i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="material-icons close">close</i>\n\n            <h4 style="font-weight: bold;">${assignment.title}</h4>\n\n            <div>\n                ${assignment.dueAt?`<div class="assignmentChip"><i class="material-icons">alarm</i><span>Due ${dtps.formatDate(assignment.dueAt)}</span></div>`:""}\n                ${assignment.turnedIn?`<div title="Assignment submitted" class="assignmentChip" style="color: #0bb75b"><i class="material-icons">assignment_turned_in</i></div>`:""}\n                ${assignment.missing?`<div  title="Assignment is missing" class="assignmentChip" style="color: #c44848"><i class="material-icons">remove_circle_outline</i></div>`:""}\n                ${assignment.late?`<div title="Assignment is late" class="assignmentChip" style="color: #c44848"><i class="material-icons">assignment_late</i></div>`:""}\n                ${assignment.locked?`<div title="Assignment submissions are locked" class="assignmentChip" style="color: var(--secText, gray);"><i style="font-family: 'Material Icons Extended';" class="material-icons">lock_outline</i></div>`:""}\n                ${scoreHTML}\n            </div>\n\n            <div style="margin-top: 20px;" class="assignmentBody">\n                ${assignment.body?`<iframe id="assignmentIframe" onload="dtps.iframeLoad('assignmentIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${assignmentBodyURL}" />`:""}\n            </div>\n\n            ${assignment.body?`<div style="margin: 5px 0px; background-color: var(--darker); height: 1px; width: 100%;" class="divider"></div>`:""}\n\n            <div style="width: calc(40% - 2px); margin-top: 20px; display: inline-block; overflow: hidden; vertical-align: top;">\n                ${assignment.publishedAt?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">add_box</i> Published: ${dtps.formatDate(assignment.publishedAt)}</p>`:""}\n                ${assignment.dueAt?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">alarm</i> Due: ${dtps.formatDate(assignment.dueAt)}</p>`:""}\n                ${assignment.value?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">bar_chart</i> Point value: ${assignment.value}</p>`:""}\n                ${assignment.grade||assignment.grade==0?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assessment</i> Points earned: ${assignment.grade}</p>`:""}\n                ${assignment.letter?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">font_download</i> Letter grade: ${assignment.letter}</p>`:""}\n                ${assignment.category?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">category</i> Category: ${assignment.category}</p>`:""}\n                ${assignment.rubric?assignment.rubric.map((function(rubricItem){return`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">adjust</i> ${rubricItem.title}</p>`})).join(""):""}\n                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">class</i> Class: ${dtps.classes[assignment.class].subject}</p>\n                ${dtps.env=="dev"?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">code</i> Assignment ID: ${assignment.id}</p>`:""}\n\n                <br />\n                <div class="row">\n                    ${assignment.url?`<div class="btn small outline" onclick="window.open('${assignment.url}')"><i class="material-icons">open_in_new</i> Open in ${dtpsLMS.shortName||dtpsLMS.name}</div>`:``}\n                </div>\n            </div>\n\n            <div style="width: calc(60% - 7px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">\n                ${assignmentFeedbackHTML}\n\n                ${assignmentRubricHTML}\n            </div>\n        `);fluid.cards.close(".card.focus");fluid.modal(".card.details")};dtps.search=function(){if($("input.search").val()==""){fluid.screen()}else{var input=$("input.search").val();var search=new Fuse(dtps.classes[dtps.selectedClass].assignments,{keys:["title","body"]});dtps.classStream(dtps.classes[dtps.selectedClass].id,search.search(input),input)}};dtps.moduleStream=function(classID){var classNum=dtps.classes.map(course=>course.id).indexOf(classID);dtps.selectedClass=classNum;dtps.selectedContent="moduleStream";$("#dtpsTabBar .btn").removeClass("active");$("#dtpsTabBar .btn.stream").addClass("active");dtps.presentClass(classNum);dtps.showClasses();if(classNum==-1){dtps.error("The selected class doesn't exist","classNum check failed @ dtps.moduleStream")}if(dtps.selectedClass==classNum&&dtps.selectedContent=="moduleStream"){jQuery(".classContent").html(dtps.renderClassTools(classNum,"modules")+`<div class="spinner"></div>`)}new Promise(resolve=>{if(dtps.classes[classNum].modules&&dtps.classes[classNum].modules!==true){resolve(dtps.classes[classNum].modules)}else{dtpsLMS.fetchModules(dtps.classes[classNum].id).then(data=>resolve(data))}}).then(data=>{dtps.classes[classNum].modules=data;var modulesHTML=dtps.renderClassTools(classNum,"modules");data.forEach(module=>{var moduleItemHTML="";module.items.forEach(item=>{var icon="list";if(item.type=="assignment")icon="assignment";if(item.type=="page")icon="insert_drive_file";if(item.type=="discussion")icon="forum";if(item.type=="url")icon="open_in_new";if(item.type=="header")icon="format_size";if(item.type=="embed")icon="web";var action="";if(item.type=="assignment")action="dtps.assignment('"+item.id+"', "+classNum+")";if(item.type=="page"){if(dtps.classes[classNum].pages){action="fluid.screen('pages', '"+classID+"|"+item.id+"')"}else{action="window.open('"+item.url+"')"}}if(item.type=="discussion"){if(dtps.classes[classNum].discussions){action="fluid.screen('discussions', '"+classID+"|"+item.id+"')"}else{action="window.open('"+item.url+"')"}}if(item.type=="url")action="window.open('"+item.url+"')";if(item.type=="header")action="";if(item.type=="embed")action="dtps.showIFrameCard('"+item.url+"')";if(item.type=="header"){moduleItemHTML+=`<h5 style="font-size: 22px;padding: 2px 10px;">${item.title}</h5>`}else{moduleItemHTML+=`\n                        <div class="moduleItem" onclick="${action}" style="margin-left: ${item.indent*15}px;">\n                            <i class="material-icons">${icon}</i>\n                            ${item.title}\n                        </div>\n                    `}});modulesHTML+=`\n                <div class="module card ${module.collapsed?"collapsed":""}">\n                    <h4>\n                        <i onclick="dtps.moduleCollapse(this, '${dtps.classes[classNum].id}', '${module.id}');" \n                            class="material-icons collapseIcon">${module.collapsed?"keyboard_arrow_right":"keyboard_arrow_down"}</i>\n                        ${module.title}\n                    </h4>\n\n                    <div class="moduleContents" style="padding-top: 10px;">\n                        ${moduleItemHTML}\n                    </div>\n                </div>\n            `});if(data.length==0){modulesHTML+=`<div style="cursor: auto;" class="card assignment"><h4>No modules</h4><p>There aren't any modules in this class yet</p></div>`}if(dtps.selectedClass==classNum&&dtps.selectedContent=="moduleStream"){jQuery(".classContent").html(modulesHTML)}}).catch(err=>{dtps.error("Could not load modules","Caught promise rejection @ dtps.moduleStream",err)})};dtps.moduleCollapse=function(ele,classID,modID){$(ele).parents(".card").toggleClass("collapsed");if($(ele).parents(".card").hasClass("collapsed")){if(dtpsLMS.collapseModule)dtpsLMS.collapseModule(classID,modID,true);$(ele).html("keyboard_arrow_right")}else{if(dtpsLMS.collapseModule)dtpsLMS.collapseModule(classID,modID,false);$(ele).html("keyboard_arrow_down")}};dtps.renderClassTools=function(num,type,searchText){var modulesSelector=dtps.classes[num].modules;return`\n        <div style="position: absolute;display:inline-block;margin: ${modulesSelector?"82px":"38px 82px"};">\n\n            ${dtps.classes[num].teacher?`\n                <div class="acrylicMaterial" style="border-radius: 20px; display: inline-block; margin-right: 5px;">\n                    <img src="${dtps.classes[num].teacher.photoURL}" style="width: 40px; height: 40px; border-radius: 50%;vertical-align: middle;"> \n                    <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 10px;">${dtps.classes[num].teacher.name}</div>\n                </div>`:``}\n\n            <div onclick="dtps.classInfo(${num})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">\n                <i style="line-height: 40px;" class="material-icons">info</i>\n            </div>\n\n            ${dtps.classes[num].homepage?`\n                <div onclick="dtps.classHome(${num})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">\n                    <i style="line-height: 40px;" class="material-icons">home</i>\n                </div>`:""}\n\n        ${dtps.classes[num].videoMeetingURL?`\n                <div onclick="window.open('${dtps.classes[num].videoMeetingURL}')" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">\n                    <i style="line-height: 40px;" class="material-icons">videocam</i>\n                </div>`:""}\n\n        </div>\n        \n        ${type=="modules"||type=="stream"?`\n            <div style="text-align: right;${modulesSelector?"":"margin-top: 20px;"}">\n\n                ${type=="stream"?`<i class="inputIcon material-icons">search</i><input ${searchText?`value="${searchText}"`:``} onchange="dtps.search()" class="search inputIcon filled shadow" placeholder="Search assignments" type="search" />`:""}\n\n                <br />\n                ${modulesSelector?`\n                    <div class="btns row small acrylicMaterial assignmentPicker" style="margin: ${type=="stream"?`20px 80px 20px 0px !important`:`63px 80px 20px 0px !important`};">\n                        <button class="btn ${type=="stream"?"active":""}" onclick="fluid.screen('stream', dtps.classes[dtps.selectedClass].id);"><i class="material-icons">assignment</i>Assignments</button>\n                        <button class="btn ${type=="modules"?"active":""}" onclick="fluid.screen('moduleStream', dtps.classes[dtps.selectedClass].id);"><i class="material-icons">view_module</i>Modules</button>\n                    </div>\n                `:``}\n                \n            </div>`:``}\n    `};dtps.classInfo=function(num){if(dtps.classes[num].syllabus!==""&&dtps.classes[num].syllabus!==null){var computedBackgroundColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");var computedTextColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--text");var blob=new Blob([`\n            <base target="_blank" /> \n            <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n            <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>\n            ${dtps.classes[num].syllabus}\n        `],{type:"text/html"});var syllabusURL=window.URL.createObjectURL(blob)}$(".card.details").html(`\n        <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>\n\n        <h4 style="font-weight: bold;">${dtps.classes[num].name}</h4>\n        <p style="color: var(--secText)">${dtps.classes[num].description||""}</p>\n\n        ${dtps.classes[num].numStudents?`<div class="assignmentChip"><i class="material-icons">group</i><span>${dtps.classes[num].numStudents} students</span></div>`:``}\n        ${dtps.env=="dev"?`<div class="assignmentChip"><i class="material-icons">code</i><span>Class ID: ${dtps.classes[num].id}</span></div>`:``}\n    \n        <br />\n\n        <div style="margin-top: 20px;" class="syllabusBody">\n            ${dtps.classes[num].syllabus?`\n                <iframe id="syllabusIframe" onload="dtps.iframeLoad('syllabusIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${syllabusURL}" />`:""}\n        </div>\n    `);fluid.modal(".card.details")};dtps.classHome=function(num){$(".card.details").html(`\n        <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>\n        <h4 style="font-weight: bold;">${dtps.classes[num].subject} Homepage</h4>\n\n        <br />\n        <p>Loading...</p>\n    `);dtpsLMS.fetchHomepage(dtps.classes[num].id).then(homepage=>{if(homepage){var computedBackgroundColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");var computedTextColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--text");var blob=new Blob([`\n                <base target="_blank" /> \n                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>\n                ${homepage}\n            `],{type:"text/html"});var homepageURL=window.URL.createObjectURL(blob);$(".card.details").html(`\n                <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>\n\n                <h4 style="font-weight: bold;">${dtps.classes[num].subject} Homepage</h4>\n\n                <br />\n                <div style="margin-top: 20px;" class="homepageBody">\n                    <iframe id="homepageIframe" onload="dtps.iframeLoad('homepageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${homepageURL}" />\n                </div>\n            `);fluid.modal(".card.details")}else{fluid.cards.close(".card.details");dtps.error("Homepage unavailable","homepage is either empty or undefined @ dtps.classHome")}}).catch(e=>{dtps.error("Couldn't load homepage","Caught a promise rejection @ dtps.classHome",e)})};dtps.gradebook=function(classID){var classNum=dtps.classes.map(course=>course.id).indexOf(classID);dtps.selectedClass=classNum;dtps.selectedContent="grades";$("#dtpsTabBar .btn").removeClass("active");$("#dtpsTabBar .btn.grades").addClass("active");dtps.presentClass(classNum);dtps.showClasses();if(classNum==-1){dtps.error("The selected class doesn't exist","classNum check failed @ dtps.gradebook")}if(dtps.selectedClass==classNum&&dtps.selectedContent=="grades"){jQuery(".classContent").html(`<div class="spinner"></div>`)}if(!dtps.classes[classNum].letter||!dtps.classes[classNum].assignments){return}var zeros=0;var totalPoints=0;var earnedPoints=0;var gradedAssignments=0;var assignmentHTML="";dtps.classes[classNum].assignments.forEach(assignment=>{if(assignment.grade||assignment.grade==0){earnedPoints+=assignment.grade;gradedAssignments++;assignmentHTML+=`\n                <div onclick="dtps.assignment('${assignment.id}', ${classNum})" class="gradebookAssignment card">\n                    <h5>\n                        ${assignment.title}\n\n                        <div class="stats">\n                            ${assignment.letter?`<div class="gradebookLetter">${assignment.letter}</div>`:""}\n                            <div class="gradebookScore">${assignment.grade}</div>\n                            <div class="gradebookValue">/${assignment.value}</div>\n                            <div class="gradebookPercentage">${Math.round(assignment.grade/assignment.value*100)}%</div>\n                        </div>\n                    </h5>\n                </div>\n            `}if(assignment.value){totalPoints+=assignment.value}if(assignment.grade==0&&assignment.value){zeros++}});var gradeCalcSummary=`\n        <div style="--classColor: ${dtps.classes[classNum].color}" class="card">\n            <h3 class="gradeTitle">\n                Grade Summary\n                <div class="classGradeCircle">\n                    ${dtps.classes[classNum].grade?`<span class="percentage">${dtps.classes[classNum].grade}%</span>`:``}\n                    <div class="letter">${dtps.classes[classNum].letter||``}</div>\n                </div>\n            </h3>\n\n            ${zeros?`\n                <h5 style="color: #d63d3d;" class="gradeStat">\n                    Zeros\n                    <div style="color: #d63d3d;" class="numFont">${zeros}</div>\n                </h5>\n            `:``}\n\n            <div style="${dtps.gradebookExpanded?"":"display: none;"}" id="classGradeMore">\n                <br />\n\n                ${dtps.classes[classNum].previousLetter?`\n                    <h5 class="smallStat">\n                        Previous Grade\n                        <div class="numFont">${dtps.classes[classNum].previousLetter}</div>\n                    </h5>\n                `:``}\n\n                <h5 class="smallStat">\n                    Points\n                    <div class="numFont fraction">\n                        <span class="earned">${earnedPoints}</span>\n                        <span class="total">/${totalPoints}</span>\n                    </div>\n                </h5>\n\n                <h5 class="smallStat">\n                    Graded Assignments\n                    <div class="numFont">${gradedAssignments}</div>\n                </h5>\n            </div>\n\n            <br />\n            <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"\n                style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded?"Show less":"Show more"}</a>\n        </div>\n\n        <br />\n    `;if(dtps.selectedClass==classNum&&dtps.selectedContent=="grades"){$(".classContent").html(gradeCalcSummary+assignmentHTML)}};fluid.externalScreens.dashboard=()=>{dtps.masterStream()};fluid.externalScreens.stream=courseID=>{dtps.classStream(courseID)};fluid.externalScreens.moduleStream=courseID=>{dtps.moduleStream(courseID)};fluid.externalScreens.gradebook=courseID=>{dtps.gradebook(courseID)};
//# sourceMappingURL=/scripts/assignments.js.map