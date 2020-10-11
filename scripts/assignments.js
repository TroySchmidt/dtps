/**
 * @file DTPS assignment functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */
dtps.renderAssignment=function(s){var e=dtps.renderAssignmentScore(s);return`\n        <div \n            onclick="${"dtps.assignment('"+s.id+"', "+s.class+")"}" \n            class="card ${e?"graded assignment":"assignment"}"\n            style="${"--classColor: "+dtps.classes[s.class].color}"\n        >\n\n            \x3c!-- Color bar for the dashboard --\x3e\n            <div class="colorBar"></div>\n\n            \x3c!-- Assignment title and points --\x3e\n            <h4>\n                <span>${s.title}</span>\n\n                \x3c!-- Points display --\x3e\n                ${e?`<div class="points">${e}</div>`:""}\n            </h4>\n\n            <h5 style="white-space: nowrap; overflow: hidden;">\n                \x3c!-- Assignment info --\x3e\n                ${s.dueAt?'<div class="infoChip"><i style="margin-top: -2px;" class="material-icons">alarm</i> Due '+dtps.formatDate(s.dueAt)+"</div>":""}\n                ${s.outcomes?'<div class="infoChip weighted"><i class="material-icons">adjust</i>'+s.outcomes.length+"</div>":""}\n                ${s.category?'<div class="infoChip weighted"><i class="material-icons">category</i> '+s.category+"</div>":""}\n\n                \x3c!-- Status icons --\x3e\n                ${s.turnedIn?'<i title="Assignment submitted" class="material-icons statusIcon" style="color: #0bb75b;">assignment_turned_in</i>':""}\n                ${s.missing?'<i title="Assignment is missing" class="material-icons statusIcon" style="color: #c44848;">remove_circle_outline</i>':""}\n                ${s.late?'<i title="Assignment is late" class="material-icons statusIcon" style="color: #c44848;">assignment_late</i>':""}\n                ${s.locked?'<i title="Assignment submissions are locked" class="material-icons statusIcon" style="font-family: \'Material Icons Extended\'; color: var(--secText, gray);">lock_outline</i>':""}\n                ${s.pending?'<i title="Grade is pending review" class="material-icons statusIcon" style="color: #b3b70b;">rate_review</i>':""}\n            </h5>\n        </div>\n    `},dtps.renderAssignmentScore=function(s){var e="";if(dtpsLMS.useRubricGrades&&s.rubric){var t=[];s.rubric.forEach(s=>{s.score&&t.push(`\n                    <div title="${s.title}" style="color: ${s.color||"var(--text)"};">\n                        ${s.score}\n                    </div>\n                `)}),t.length&&(e=`<div class="dtpsRubricScore">${t.join("")}</div>`)}else dtpsLMS.useRubricGrades||!s.grade&&0!=s.grade||(e=`\n            <div class="assignmentGrade">\n                <div class="grade">${s.grade}</div>\n                <div class="value">/${s.value}</div>\n                ${s.letter?`<div class="letter">${s.letter.replace("incomplete",'<i class="material-icons">cancel</i>').replace("complete",'<i class="material-icons">done</i>')}</div>`:""}\n                <div class="percentage">${Math.round(s.grade/s.value*100)}%</div>\n            </div>\n        `);return e},dtps.masterStream=function(){dtps.presentClass("dash"),dtps.showClasses(),$("#dtpsTabBar .btn").removeClass("active");var s=0;dtps.classes.forEach(e=>{e.assignments&&s++});var e=s==dtps.classes.length;function t(s){return"dtps.calendar"==s.id?window.FullCalendar?'<div id="calendar" class="card" style="padding: 20px;"></div>':"":"dtps.updates"==s.id?'<div class="updatesStream recentlyGraded announcements"></div>':"dtps.dueToday"==s.id?'<div style="padding: 20px 0px;" class="dueToday"></div>':"dtps.upcoming"==s.id?'<div style="padding: 20px 0px;" class="assignmentStream"></div>':void 0}"dash"==dtps.selectedClass&&jQuery(".classContent").html(`\n            <div class="dash cal" style="width: 40%;display: inline-block; vertical-align: top;">\n                ${dtps.leftDashboard.map(s=>t(s)).join("")}\n            </div>\n\n            <div style="width: 59%; display: inline-block;" class="dash stream">\n                ${e?"":'<div style="margin: 75px 25px 10px 75px;"><div class="spinner"></div></div>'}\n                ${dtps.rightDashboard.map(s=>t(s)).join("")}\n            </div>\n        `),dtps.renderUpdates(),dtps.renderUpcoming(e),dtps.calendar(),dtps.renderDueToday(e)},dtps.renderDueToday=function(s){var e=[];dtps.classes&&dtps.classes.forEach(s=>{s.assignments&&s.assignments.forEach(s=>{dtps.isToday(s.dueAt)&&e.push(s)})}),e.sort((function(s,e){var t=new Date(s.dueAt).getTime(),a=new Date(e.dueAt).getTime();return t>a?1:t<a?-1:0}));var t=e.map(s=>dtps.renderAssignment(s)).join("");t=0==e.length?s?'<p style="text-align: center;margin: 10px 25px 10px 75px; font-size: 18px;"><i class="material-icons">done</i> Nothing due today</p>':"":'\n            <h5 style="text-align: center; margin: 10px 25px 10px 75px; font-weight: bold;">Due today</h5>\n        '+t,"dash"==dtps.selectedClass&&jQuery(".classContent .dash .dueToday").html(t)},dtps.renderUpcoming=function(){var s=[];dtps.classes&&dtps.classes.forEach(e=>{e.assignments&&e.assignments.forEach(e=>{new Date(e.dueAt)>new Date&&!dtps.isToday(e.dueAt)&&s.push(e)})}),s.sort((function(s,e){var t=new Date(s.dueAt).getTime(),a=new Date(e.dueAt).getTime();return t>a?1:t<a?-1:0}));var e=s.map(s=>dtps.renderAssignment(s)).join("");0==s.length&&(e=""),"dash"==dtps.selectedClass&&jQuery(".classContent .dash .assignmentStream").html(e)},dtps.renderUpdates=function(){var s="";dtps.updates.forEach(e=>{if("announcement"==e.type)s+=`\n                <div onclick="$(this).toggleClass('open');" style="cursor: pointer; padding: 20px; --classColor: ${dtps.classes[e.class].color};" class="announcement card">\n                    <div class="className">${e.title}</div>\n                    ${e.body}\n                </div>\n            `;else if("assignment"==e.type){var t=dtps.renderAssignmentScore(e);s+=`\n                <div onclick="dtps.assignment('${e.id}', ${e.class})" style="--classColor: ${dtps.classes[e.class].color};" class="card recentGrade">\n                    <h5>\n                        <span>${e.title}</span>\n\n                        \x3c!-- Points display --\x3e\n                        ${t?`<div class="points">${t}</div>`:""}\n                    </h5>\n\n                    <p>Graded at ${dtps.formatDate(e.gradedAt)}</p>\n                </div>\n            `}}),"dash"==dtps.selectedClass&&jQuery(".classContent .dash .updatesStream").html(s)},dtps.calendar=function(){if("dash"==dtps.selectedClass){var s=[];if(dtps.classes.forEach((e,t)=>{e.assignments&&e.assignments.forEach(a=>{s.push({title:a.title,start:a.dueAt,id:a.id,allDay:!0,backgroundColor:e.color,textColor:"white",classNum:t,assignmentID:a.id})})}),window.FullCalendar){var e=document.getElementById("calendar");calendar=new FullCalendar.Calendar(e,{locale:"en",initialView:"dayGridMonth",events:s,contentHeight:0,handleWindowResize:!1,headerToolbar:{start:"title",center:"",end:"prev,next"},eventClick:function(s){console.log(s),dtps.assignment(s.event.extendedProps.assignmentID,s.event.extendedProps.classNum)}}),calendar.render()}}},dtps.classStream=function(s,e,t){var a=dtps.classes.map(s=>s.id).indexOf(s);dtps.selectedClass=a,dtps.selectedContent="stream",$("#dtpsTabBar .btn").removeClass("active"),$("#dtpsTabBar .btn.stream").addClass("active"),dtps.presentClass(a),dtps.showClasses(),-1==a&&dtps.error("The selected class doesn't exist","classNum check failed @ dtps.classStream");var n=e||dtps.classes[a].assignments;if(n)if(0==n.length)t?dtps.selectedClass==a&&"stream"==dtps.selectedContent&&$(".classContent").html(dtps.renderClassTools(a,"stream",t)+'\n                    <div style="cursor: auto;" class="card assignment">\n                        <h4>No results</h4>\n                        <p>There weren\'t any search results</p>\n                        <button onclick="fluid.screen()" class="btn"><i class="material-icons">arrow_back</i> Back</button>\n                    </div>\n                '):dtps.selectedClass==a&&"stream"==dtps.selectedContent&&$(".classContent").html(dtps.renderClassTools(a,"stream",t)+'<div style="cursor: auto;" class="card assignment"><h4>No assignments</h4><p>There aren\'t any assignments in this class yet</p></div>');else{n.sort((function(s,e){var t=new Date(s.dueAt).getTime(),a=new Date(e.dueAt).getTime(),n=(new Date).getTime();return s.dueAt||(t=0),e.dueAt||(a=0),t<n||a<n?t<a?1:t>a?-1:0:t>a?1:t<a?-1:0}));var l=null,i=n.map(s=>{var e="";return s.dueAt?new Date(s.dueAt)<new Date?(l&&"old"!==l&&(e='<h5 style="margin: 75px 75px 10px 75px;font-weight: bold;">Old Assignments</h5>'),l="old"):l="upcoming":(l&&"undated"!==l&&(e='<h5 style="margin: 75px 75px 10px 75px;font-weight: bold;">Undated Assignments</h5>'),l="undated"),e+dtps.renderAssignment(s)}).join("");i=dtps.renderClassTools(a,"stream",t)+i,dtps.selectedClass==a&&"stream"==dtps.selectedContent&&$(".classContent").html(i)}else dtps.selectedClass==a&&"stream"==dtps.selectedContent&&jQuery(".classContent").html(dtps.renderClassTools(a,"stream",t)+'<div class="spinner"></div>')},dtps.assignment=function(s,e){var t=dtps.classes[e].assignments.map(s=>s.id),a=dtps.classes[e].assignments[t.indexOf(s)],n=null;if(a.body){var l=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards"),i=getComputedStyle($(".card.details")[0]).getPropertyValue("--text"),d=new Blob([`\n                <base target="_blank" /> \n                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                <style>body {background-color: ${l}; color: ${i};</style>\n                ${a.body}\n            `],{type:"text/html"});n=window.URL.createObjectURL(d)}var r="";if(a.rubric)r=a.rubric.map((function(s){return`\n                    <div class="dtpsAssignmentRubricItem">\n                        <h5>${s.title}</h5>\n                        <div class="score">\n                            <p style="color: ${s.color?s.color:"var(--secText)"};" class="scoreName">\n                                ${s.score?s.scoreName||"":"Not assessed"}\n\n                                <div class="points">\n                                    <p class="earned">${s.score||"-"}</p>\n                                    <p class="possible">${"/"+s.value}</p>\n                                </div>\n                            </p>\n                        </div>\n                    </div>\n                `})).join("");var c="";if(a.feedback)c=a.feedback.map(s=>`\n                    <div class="dtpsSubmissionComment">\n                        ${s.author?`\n                            <img src="${s.author.photoURL}" />\n                            <h5>${s.author.name}</h5>\n                        `:""}\n\n                        <p>${s.comment}</p>\n                    </div>\n                `).join("");var o=dtps.renderAssignmentScore(a);$(".card.details").html(`\n            <i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="material-icons close">close</i>\n\n            <h4 style="font-weight: bold;">${a.title}</h4>\n\n            <div>\n                ${a.dueAt?`<div class="assignmentChip"><i class="material-icons">alarm</i><span>Due ${dtps.formatDate(a.dueAt)}</span></div>`:""}\n                ${a.turnedIn?'<div title="Assignment submitted" class="assignmentChip" style="color: #0bb75b"><i class="material-icons">assignment_turned_in</i></div>':""}\n                ${a.missing?'<div  title="Assignment is missing" class="assignmentChip" style="color: #c44848"><i class="material-icons">remove_circle_outline</i></div>':""}\n                ${a.late?'<div title="Assignment is late" class="assignmentChip" style="color: #c44848"><i class="material-icons">assignment_late</i></div>':""}\n                ${a.locked?'<div title="Assignment submissions are locked" class="assignmentChip" style="color: var(--secText, gray);"><i style="font-family: \'Material Icons Extended\';" class="material-icons">lock_outline</i></div>':""}\n                ${o}\n            </div>\n\n            <div style="margin-top: 20px;" class="assignmentBody">\n                ${a.body?`<iframe id="assignmentIframe" onload="dtps.iframeLoad('assignmentIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${n}" />`:""}\n            </div>\n\n            ${a.body?'<div style="margin: 5px 0px; background-color: var(--darker); height: 1px; width: 100%;" class="divider"></div>':""}\n\n            <div style="width: calc(40% - 2px); margin-top: 20px; display: inline-block; overflow: hidden; vertical-align: top;">\n                ${a.publishedAt?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">add_box</i> Published: ${dtps.formatDate(a.publishedAt)}</p>`:""}\n                ${a.dueAt?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">alarm</i> Due: ${dtps.formatDate(a.dueAt)}</p>`:""}\n                ${a.value?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">bar_chart</i> Point value: ${a.value}</p>`:""}\n                ${a.grade||0==a.grade?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">assessment</i> Points earned: ${a.grade}</p>`:""}\n                ${a.letter?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">font_download</i> Letter grade: ${a.letter}</p>`:""}\n                ${a.category?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">category</i> Category: ${a.category}</p>`:""}\n                ${a.rubric?a.rubric.map((function(s){return`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">adjust</i> ${s.title}</p>`})).join(""):""}\n                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">class</i> Class: ${dtps.classes[a.class].subject}</p>\n                ${"dev"==dtps.env?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="material-icons">code</i> Assignment ID: ${a.id}</p>`:""}\n\n                <br />\n                <div class="row">\n                    ${a.url?`<div class="btn small outline" onclick="window.open('${a.url}')"><i class="material-icons">open_in_new</i> Open in ${dtpsLMS.shortName||dtpsLMS.name}</div>`:""}\n                </div>\n            </div>\n\n            <div style="width: calc(60% - 7px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">\n                ${c}\n\n                ${r}\n            </div>\n        `),fluid.cards.close(".card.focus"),fluid.modal(".card.details")},dtps.search=function(){if(""==$("input.search").val())fluid.screen();else{var s=$("input.search").val(),e=new Fuse(dtps.classes[dtps.selectedClass].assignments,{keys:["title","body"]});dtps.classStream(dtps.classes[dtps.selectedClass].id,e.search(s),s)}},dtps.moduleStream=function(s){var e=dtps.classes.map(s=>s.id).indexOf(s);dtps.selectedClass=e,dtps.selectedContent="moduleStream",$("#dtpsTabBar .btn").removeClass("active"),$("#dtpsTabBar .btn.stream").addClass("active"),dtps.presentClass(e),dtps.showClasses(),-1==e&&dtps.error("The selected class doesn't exist","classNum check failed @ dtps.moduleStream"),dtps.selectedClass==e&&"moduleStream"==dtps.selectedContent&&jQuery(".classContent").html(dtps.renderClassTools(e,"modules")+'<div class="spinner"></div>'),new Promise(s=>{dtps.classes[e].modules&&!0!==dtps.classes[e].modules?s(dtps.classes[e].modules):dtpsLMS.fetchModules(dtps.classes[e].id).then(e=>s(e))}).then(t=>{dtps.classes[e].modules=t;var a=dtps.renderClassTools(e,"modules");t.forEach(t=>{var n="";t.items.forEach(t=>{var a="list";"assignment"==t.type&&(a="assignment"),"page"==t.type&&(a="insert_drive_file"),"discussion"==t.type&&(a="forum"),"url"==t.type&&(a="open_in_new"),"header"==t.type&&(a="format_size"),"embed"==t.type&&(a="web");var l="";"assignment"==t.type&&(l="dtps.assignment('"+t.id+"', "+e+")"),"page"==t.type&&(l="fluid.screen('pages', '"+s+"|"+t.id+"|true')"),"discussion"==t.type&&(l="fluid.screen('discussions', '"+s+"|"+t.id+"|true')"),"url"==t.type&&(l="window.open('"+t.url+"')"),"header"==t.type&&(l=""),"embed"==t.type&&(l="dtps.showIFrameCard('"+t.url+"')"),"header"==t.type?n+=`<h5 style="font-size: 22px;padding: 2px 10px;">${t.title}</h5>`:n+=`\n                        <div class="moduleItem" onclick="${l}" style="margin-left: ${15*t.indent}px;">\n                            <i ${t.completed?'style="color: #27ba3c"':""} class="material-icons">${t.completed?"check":a}</i>\n                            ${t.title}\n                        </div>\n                    `}),a+=`\n                <div class="module card ${t.collapsed?"collapsed":""}">\n                    <h4>\n                        <i onclick="dtps.moduleCollapse(this, '${dtps.classes[e].id}', '${t.id}');" \n                            class="material-icons collapseIcon">${t.collapsed?"keyboard_arrow_right":"keyboard_arrow_down"}</i>\n                        ${t.title}\n                    </h4>\n\n                    <div class="moduleContents" style="padding-top: 10px;">\n                        ${n}\n                    </div>\n                </div>\n            `}),0==t.length&&(a+='<div style="cursor: auto;" class="card assignment"><h4>No modules</h4><p>There aren\'t any modules in this class yet</p></div>'),dtps.selectedClass==e&&"moduleStream"==dtps.selectedContent&&jQuery(".classContent").html(a)}).catch(s=>{dtps.error("Could not load modules","Caught promise rejection @ dtps.moduleStream",s)})},dtps.moduleCollapse=function(s,e,t){$(s).parents(".card").toggleClass("collapsed"),$(s).parents(".card").hasClass("collapsed")?(dtpsLMS.collapseModule&&dtpsLMS.collapseModule(e,t,!0),$(s).html("keyboard_arrow_right")):(dtpsLMS.collapseModule&&dtpsLMS.collapseModule(e,t,!1),$(s).html("keyboard_arrow_down"))},dtps.renderClassTools=function(s,e,t){var a=dtps.classes[s].modules;return`\n        <div style="position: absolute;display:inline-block;margin: ${a?"82px":"38px 82px"};">\n\n            ${dtps.classes[s].teacher?`\n                <div class="acrylicMaterial" style="border-radius: 20px; display: inline-block; margin-right: 5px;">\n                    <img src="${dtps.classes[s].teacher.photoURL}" style="width: 40px; height: 40px; border-radius: 50%;vertical-align: middle;"> \n                    <div style="font-size: 16px;display: inline-block;vertical-align: middle;margin: 0px 10px;">${dtps.classes[s].teacher.name}</div>\n                </div>`:""}\n\n            <div onclick="dtps.classInfo(${s})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">\n                <i style="line-height: 40px;" class="material-icons">info</i>\n            </div>\n\n            ${dtps.classes[s].homepage?`\n                <div onclick="dtps.classHome(${s})" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">\n                    <i style="line-height: 40px;" class="material-icons">home</i>\n                </div>`:""}\n\n        ${dtps.classes[s].videoMeetingURL?`\n                <div onclick="window.open('${dtps.classes[s].videoMeetingURL}')" class="acrylicMaterial" style="border-radius: 50%; height: 40px; width: 40px; text-align: center; display: inline-block; vertical-align: middle; cursor: pointer; margin-right: 3px;">\n                    <i style="line-height: 40px;" class="material-icons">videocam</i>\n                </div>`:""}\n\n        </div>\n        \n        ${"modules"==e||"stream"==e?`\n            <div style="text-align: right;${a?"":"margin-top: 20px;"}">\n\n                ${"stream"==e?`<i class="inputIcon material-icons">search</i><input ${t?`value="${t}"`:""} onchange="dtps.search()" class="search inputIcon filled shadow" placeholder="Search assignments" type="search" />`:""}\n\n                <br />\n                ${a?`\n                    <div class="btns row small acrylicMaterial assignmentPicker" style="margin: ${"stream"==e?"20px 80px 20px 0px !important":"63px 80px 20px 0px !important"};">\n                        <button class="btn ${"stream"==e?"active":""}" onclick="fluid.screen('stream', dtps.classes[dtps.selectedClass].id);"><i class="material-icons">assignment</i>Assignments</button>\n                        <button class="btn ${"modules"==e?"active":""}" onclick="fluid.screen('moduleStream', dtps.classes[dtps.selectedClass].id);"><i class="material-icons">view_module</i>Modules</button>\n                    </div>\n                `:""}\n                \n            </div>`:""}\n    `},dtps.classInfo=function(s){if(""!==dtps.classes[s].syllabus&&null!==dtps.classes[s].syllabus)var e=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards"),t=getComputedStyle($(".card.details")[0]).getPropertyValue("--text"),a=new Blob([`\n            <base target="_blank" /> \n            <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n            <style>body {background-color: ${e}; color: ${t};</style>\n            ${dtps.classes[s].syllabus}\n        `],{type:"text/html"}),n=window.URL.createObjectURL(a);$(".card.details").html(`\n        <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>\n\n        <h4 style="font-weight: bold;">${dtps.classes[s].name}</h4>\n        <p style="color: var(--secText)">${dtps.classes[s].description||""}</p>\n\n        ${dtps.classes[s].numStudents?`<div class="assignmentChip"><i class="material-icons">group</i><span>${dtps.classes[s].numStudents} students</span></div>`:""}\n        ${"dev"==dtps.env?`<div class="assignmentChip"><i class="material-icons">code</i><span>Class ID: ${dtps.classes[s].id}</span></div>`:""}\n    \n        <br />\n\n        <div style="margin-top: 20px;" class="syllabusBody">\n            ${dtps.classes[s].syllabus?`\n                <iframe id="syllabusIframe" onload="dtps.iframeLoad('syllabusIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${n}" />`:""}\n        </div>\n    `),fluid.modal(".card.details")},dtps.classHome=function(s){$(".card.details").html(`\n        <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>\n        <h4 style="font-weight: bold;">${dtps.classes[s].subject} Homepage</h4>\n\n        <br />\n        <p>Loading...</p>\n    `),dtpsLMS.fetchHomepage(dtps.classes[s].id).then(e=>{if(e){var t=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards"),a=getComputedStyle($(".card.details")[0]).getPropertyValue("--text"),n=new Blob([`\n                <base target="_blank" /> \n                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                <style>body {background-color: ${t}; color: ${a};</style>\n                ${e}\n            `],{type:"text/html"}),l=window.URL.createObjectURL(n);$(".card.details").html(`\n                <i onclick="fluid.cards.close('.card.details')" class="material-icons close">close</i>\n\n                <h4 style="font-weight: bold;">${dtps.classes[s].subject} Homepage</h4>\n\n                <br />\n                <div style="margin-top: 20px;" class="homepageBody">\n                    <iframe id="homepageIframe" onload="dtps.iframeLoad('homepageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${l}" />\n                </div>\n            `),fluid.modal(".card.details")}else fluid.cards.close(".card.details"),dtps.error("Homepage unavailable","homepage is either empty or undefined @ dtps.classHome")}).catch(s=>{dtps.error("Couldn't load homepage","Caught a promise rejection @ dtps.classHome",s)})},dtps.gradebook=function(s){var e=dtps.classes.map(s=>s.id).indexOf(s);if(dtps.selectedClass=e,dtps.selectedContent="grades",$("#dtpsTabBar .btn").removeClass("active"),$("#dtpsTabBar .btn.grades").addClass("active"),dtps.presentClass(e),dtps.showClasses(),-1==e&&dtps.error("The selected class doesn't exist","classNum check failed @ dtps.gradebook"),dtps.selectedClass==e&&"grades"==dtps.selectedContent&&jQuery(".classContent").html('<div class="spinner"></div>'),dtps.classes[e].letter&&dtps.classes[e].assignments){var t=0,a=0,n=0,l=0,i="";dtps.classes[e].assignments.forEach(s=>{(s.grade||0==s.grade)&&(n+=s.grade,l++,i+=`\n                <div onclick="dtps.assignment('${s.id}', ${e})" class="gradebookAssignment card">\n                    <h5>\n                        ${s.title}\n\n                        <div class="stats">\n                            ${s.letter?`<div class="gradebookLetter">${s.letter}</div>`:""}\n                            <div class="gradebookScore">${s.grade}</div>\n                            <div class="gradebookValue">/${s.value}</div>\n                            <div class="gradebookPercentage">${Math.round(s.grade/s.value*100)}%</div>\n                        </div>\n                    </h5>\n                </div>\n            `),s.value&&(a+=s.value),0==s.grade&&s.value&&t++});var d=`\n        <div style="--classColor: ${dtps.classes[e].color}" class="card">\n            <h3 class="gradeTitle">\n                Grade Summary\n                <div class="classGradeCircle">\n                    ${dtps.classes[e].grade?`<span class="percentage">${dtps.classes[e].grade}%</span>`:""}\n                    <div class="letter">${dtps.classes[e].letter||""}</div>\n                </div>\n            </h3>\n\n            ${t?`\n                <h5 style="color: #d63d3d;" class="gradeStat">\n                    Zeros\n                    <div style="color: #d63d3d;" class="numFont">${t}</div>\n                </h5>\n            `:""}\n\n            <div style="${dtps.gradebookExpanded?"":"display: none;"}" id="classGradeMore">\n                <br />\n\n                ${dtps.classes[e].previousLetter?`\n                    <h5 class="smallStat">\n                        Previous Grade\n                        <div class="numFont">${dtps.classes[e].previousLetter}</div>\n                    </h5>\n                `:""}\n\n                <h5 class="smallStat">\n                    Points\n                    <div class="numFont fraction">\n                        <span class="earned">${n}</span>\n                        <span class="total">/${a}</span>\n                    </div>\n                </h5>\n\n                <h5 class="smallStat">\n                    Graded Assignments\n                    <div class="numFont">${l}</div>\n                </h5>\n            </div>\n\n            <br />\n            <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"\n                style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded?"Show less":"Show more"}</a>\n        </div>\n\n        <br />\n    `;dtps.selectedClass==e&&"grades"==dtps.selectedContent&&$(".classContent").html(d+i)}},fluid.externalScreens.dashboard=()=>{dtps.masterStream()},fluid.externalScreens.stream=s=>{dtps.classStream(s)},fluid.externalScreens.moduleStream=s=>{dtps.moduleStream(s)},fluid.externalScreens.gradebook=s=>{dtps.gradebook(s)};
//# sourceMappingURL=/scripts/assignments.js.map