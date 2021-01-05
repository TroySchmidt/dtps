/**
 * @file DTPS assignment functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2021 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */
dtps.renderAssignment=function(e,s){var t=dtps.renderAssignmentScore(e);return`\n        <div \n            onclick="${"dtps.assignment('"+e.id+"', "+e.class+", "+!isNaN(s)+")"}" \n            class="card ${t?"graded assignment":"assignment"}"\n            style="${"--classColor: "+dtps.classes[e.class].color}"\n        >\n\n            \x3c!-- Color bar for the dashboard --\x3e\n            <div class="colorBar"></div>\n\n            \x3c!-- Assignment title and points --\x3e\n            <h4>\n                <span>${e.title}</span>\n\n                \x3c!-- Points display --\x3e\n                ${t?`<div class="points">${t}</div>`:""}\n            </h4>\n\n            <h5>\n                \x3c!-- Assignment info --\x3e\n                <div class="info">\n                    ${e.dueAt?`<div ${dtpsLMS.isUsualDueDate&&!dtpsLMS.isUsualDueDate(e.dueAt)?'style="font-weight: bold;color: var(--text);"':""} class="infoChip"><i style="margin-top: -2px;" class="fluid-icon">alarm</i> Due `+dtps.formatDate(e.dueAt)+"</div>":""}\n                    ${e.outcomes?'<div class="infoChip weighted"><i class="fluid-icon">adjust</i>'+e.outcomes.length+"</div>":""}\n                    ${e.category?'<div class="infoChip weighted"><i class="fluid-icon">category</i> '+e.category+"</div>":""}\n                    ${s?'<div class="infoChip weighted"><i class="fluid-icon">person</i> '+s+"</div>":""}\n                </div>\n\n                \x3c!-- Status icons --\x3e\n                <div class="status">\n                    ${e.turnedIn?'<i title="Assignment submitted" class="fluid-icon statusIcon" style="color: #0bb75b;">assignment_turned_in</i>':""}\n                    ${e.missing?'<i title="Assignment is missing" class="fluid-icon statusIcon" style="color: #c44848;">remove_circle_outline</i>':""}\n                    ${e.late?'<i title="Assignment is late" class="fluid-icon statusIcon" style="color: #c44848;">assignment_late</i>':""}\n                    ${e.locked?'<i title="Assignment submissions are locked" class="fluid-icon statusIcon" style="color: var(--secText, gray);">lock_outline</i>':""}\n                    ${e.pending?'<i title="Grade is pending review" class="fluid-icon statusIcon" style="color: #b3b70b;">rate_review</i>':""}\n                </div>\n            </h5>\n        </div>\n    `},dtps.renderAssignmentScore=function(e){var s="";if(dtpsLMS.useRubricGrades&&e.rubric){var t=[];e.rubric.forEach((e=>{void 0!==e.score&&t.push(`\n                    <div title="${e.title}" style="color: ${e.color||"var(--text)"};">\n                        ${e.score}\n                    </div>\n                `)})),t.length&&(s=`<div class="dtpsRubricScore">${t.join("")}</div>`)}else dtpsLMS.useRubricGrades||!e.grade&&0!=e.grade||(s=`\n            <div class="assignmentGrade">\n                <div class="grade">${Number(e.grade.toFixed(2))}</div>\n                <div class="value">/${Number(e.value.toFixed(2))}</div>\n                ${e.letter?`<div class="letter">${e.letter.replace("incomplete",'<i class="fluid-icon">cancel</i>').replace("complete",'<i class="fluid-icon">done</i>')}</div>`:""}\n                <div class="percentage">${Math.round(e.grade/e.value*100)}%</div>\n            </div>\n        `);return s},dtps.mergeAndRenderChildAssignments=function(e){var s=[];return e.forEach((e=>{var t=!1;s.forEach((s=>{var n=s[0],a=["id","dueAt","locked","category","turnedIn","late","missing","grade","value","letter"],d=0;a.forEach((s=>{e[s]==n[s]&&d++})),d==a.length&&(t=!0,s.push(e))})),t||s.push([e])})),s.map((e=>dtps.renderAssignment(e[0],1==e.length?dtps.user.children.find((s=>s.id==dtps.classes[e[0].class].userID)).name:e.length))).join("")},dtps.mainStream=function(){dtps.presentClass("dash"),dtps.showClasses(),$("#dtpsTabBar .btn").removeClass("active");var e=0;dtps.classes.forEach((s=>{s.assignments&&e++}));var s=e==dtps.classes.length;function t(e){return"dtps.calendar"==e.id?window.FullCalendar?'<div id="calendar" class="card" style="padding: 20px;"></div>':"":"dtps.updates"==e.id?'<div class="updatesStream recentlyGraded announcements"></div>':"dtps.dueToday"==e.id?'<div style="padding: 20px 0px;" class="dueToday"></div>':"dtps.upcoming"==e.id?'<div style="padding: 20px 0px;" class="assignmentStream"></div>':void 0}"dash"==dtps.selectedClass&&jQuery(".classContent").html(`\n            <div style="letter-spacing: 0px;">\n                <div style="float: left; width: 45%; display: inline-block;" class="dash">\n                    ${dtps.leftDashboard.map((e=>t(e))).join("")}\n                </div>\n\n                <div style="float: left; width: 55%; display: inline-block;" class="dash">\n                    ${s?"":'<div style="margin: 75px 25px 10px 75px;"><div class="spinner"></div></div>'}\n                    ${dtps.rightDashboard.map((e=>t(e))).join("")}\n                </div>\n            </div>\n        `),dtps.renderUpdates(),dtps.renderUpcoming(),dtps.calendar(s),dtps.renderDueToday(s)},dtps.isDueOnDate=function(e,s){var t=s?new Date(s):new Date,n=new Date(t.getTime()+864e5),a=new Date(e),d=a.getFullYear()===t.getFullYear()&&a.getMonth()===t.getMonth()&&a.getDate()===t.getDate()&&a.getHours()>=9,l=a.getFullYear()===n.getFullYear()&&a.getMonth()===n.getMonth()&&a.getDate()===n.getDate()&&a.getHours()<9;return d||l},dtps.renderDueToday=function(e,s){var t=[];if(dtps.classes&&dtps.classes.forEach((e=>{e.assignments&&e.assignments.forEach((e=>{dtps.isDueOnDate(e.dueAt,s)&&t.push(e)}))})),t.sort((function(e,s){var t=new Date(e.dueAt).getTime(),n=new Date(s.dueAt).getTime();return t>n?1:t<n?-1:0})),dtps.user.parent)var n=dtps.mergeAndRenderChildAssignments(t);else n=t.map((e=>dtps.renderAssignment(e))).join("");n=0==t.length?e?`<p style="text-align: center;margin: 10px 0px; font-size: 18px;"><i class="fluid-icon">done</i> ${s?"Nothing is due on "+s.toLocaleString("en",{weekday:"short",month:"short",day:"numeric"}):"Nothing is due today"}</p>`:"":`\n            <h5 style="text-align: center; margin: 10px 0px; font-weight: bold;">${s?"Due on "+s.toLocaleString("en",{weekday:"short",month:"short",day:"numeric"}):"Due Today"}</h5>\n        `+n,"dash"==dtps.selectedClass&&jQuery(".classContent .dash .dueToday").html(n)},dtps.renderUpcoming=function(e){var s=e?new Date(e):new Date,t=[];if(dtps.classes&&dtps.classes.forEach((e=>{e.assignments&&e.assignments.forEach((e=>{new Date(e.dueAt).getTime()>s.getTime()&&!dtps.isDueOnDate(e.dueAt,s)&&t.push(e)}))})),t.sort((function(e,s){var t=new Date(e.dueAt).getTime(),n=new Date(s.dueAt).getTime();return t>n?1:t<n?-1:0})),t.length>30&&(t.length=30),dtps.user.parent)var n=dtps.mergeAndRenderChildAssignments(t);else n=t.map((e=>dtps.renderAssignment(e))).join("");0==t.length&&(n=""),"dash"==dtps.selectedClass&&jQuery(".classContent .dash .assignmentStream").html(n)},dtps.renderUpdates=function(e){var s="";if(dtps.remoteConfig.remoteUpdate.active&&(markdown=new showdown.Converter,s+=`\n            <div style="cursor: auto; padding: 20px; --classColor: var(--secText);" class="announcement card open">\n                <div class="className">\n                    <img src="${dtps.baseURL+"/icon.svg"}" style="vertical-align: middle;width: 22px;margin-right: 5px;" />\n                    <span style="font-weight: bold; vertical-align: middle; color: var(--text); font-size: 18px;">${dtps.remoteConfig.remoteUpdate.title}</span>\n                </div>\n                ${markdown.makeHtml(dtps.remoteConfig.remoteUpdate.md)}\n            </div>\n        `),e&&"dash"==dtps.selectedClass)return jQuery(".classContent .dash .updatesStream").html('\n            <div style="cursor: auto; padding: 20px; --classColor: var(--secText);" class="announcement card open">\n                <div class="className">Date Selected</div>\n                <p>Updates are not shown while a date is selected</p>\n            </div>\n        ');dtps.updates.forEach((e=>{if("announcement"==e.type)s+=`\n                <div onclick="$(this).toggleClass('open');" style="cursor: pointer; padding: 20px; --classColor: ${dtps.classes[e.class].color};" class="announcement card">\n                    <div class="className">${e.title}</div>\n                    ${e.body}\n                </div>\n            `;else if("assignment"==e.type){var t=dtps.renderAssignmentScore(e);s+=`\n                <div onclick="dtps.assignment('${e.id}', ${e.class})" style="--classColor: ${dtps.classes[e.class].color};" class="card recentGrade">\n                    <h5>\n                        <span>${e.title}</span>\n\n                        \x3c!-- Points display --\x3e\n                        ${t?`<div class="points">${t}</div>`:""}\n                    </h5>\n\n                    <p>${dtps.user.parent?"Graded for "+dtps.user.children.find((s=>s.id==dtps.classes[e.class].userID)).name:"Graded"} at ${dtps.formatDate(e.gradedAt)}</p>\n                </div>\n            `}})),"dash"==dtps.selectedClass&&jQuery(".classContent .dash .updatesStream").html(s)},dtps.calendar=function(e){if("dash"==dtps.selectedClass){var s=[];if(dtps.classes.forEach(((e,t)=>{e.assignments&&e.assignments.forEach((n=>{var a=new Date(n.dueAt);a.getHours()<9&&(a.setTime(a.getTime()-864e5),a.setHours(23),a.setMinutes(59));var d=s.find((e=>e.id==n.id));d&&n.missing?(d.missing=!0,d.borderColor="#c44848",d.assignmentID=n.id,d.classNum=t):d||s.push({title:n.title,start:a,id:n.id,allDay:!0,backgroundColor:e.color,borderColor:!0===n.missing?"#c44848":"transparent",textColor:"white",classNum:t,assignmentID:n.id,missing:n.missing})}))})),window.FullCalendar){var t=document.getElementById("calendar");calendar=new FullCalendar.Calendar(t,{locale:"en",initialView:"dayGridMonth",events:s,eventContent:e=>{const{missing:s}=e.event.extendedProps;return{html:`\n                        <div class='fc-event-main-frame'>\n                            <div class='fc-event-title-container'>\n                                <div class='fc-event-title fc-sticky'>\n                                    ${s?'<i title="Assignment is missing" class="fluid-icon statusIcon">remove_circle_outline</i>':""}\n                                    <span style="vertical-align: middle;">${e.event.title}</span>\n                                </div>\n                            </div>\n                        </div>\n                    `}},contentHeight:0,handleWindowResize:!1,headerToolbar:{start:"title",center:"",end:"prev,next"},dateClick:function(s){if($(s.dayEl).hasClass("fc-day-today"))return fluid.screen();$("#calendar .fc-daygrid-day").removeClass("active"),$(s.dayEl).addClass("active"),$("#calendar").addClass("dateSelected"),$(".headerArea .contentLabel i").text("event"),$(".headerArea .contentLabel span").text("Showing assignments from "+s.date.toLocaleString("en",{weekday:"short",month:"short",day:"numeric"})),$(".headerArea .contentLabel").show(),dtps.renderDueToday(e,s.date),dtps.renderUpcoming(s.date),dtps.renderUpdates(!0)},eventClick:function(e){dtps.assignment(e.event.extendedProps.assignmentID,e.event.extendedProps.classNum)}}),calendar.render()}}},dtps.classStream=function(e,s){var t=dtps.classes.map((e=>e.id)).indexOf(e);dtps.selectedClass=t,dtps.selectedContent="stream",$("#dtpsTabBar .btn").removeClass("active"),$("#dtpsTabBar .btn.stream").addClass("active"),window.localStorage.setItem("courseworkPref-"+e,"stream"),dtps.presentClass(t),dtps.showClasses(),-1==t&&dtps.error("The selected class doesn't exist","classNum check failed @ dtps.classStream");var n=s||dtps.classes[t].assignments;if(n)if(0==n.length)dtps.selectedClass==t&&"stream"==dtps.selectedContent&&$(".classContent").html(dtps.renderStreamTools(t,"stream")+'\n                <div style="text-align: center;">\n                    <div style="margin: 60px; padding: 20px 40px; display: inline-block; border: 2px solid var(--elements); border-radius: var(--elementRadius);">\n                        <h5>No Assignments</h5>\n                        <p>There aren\'t any assignments in this class yet.</p>\n                    </div>\n                </div>\n            ');else{n.sort((function(e,s){var t=new Date(e.dueAt).getTime(),n=new Date(s.dueAt).getTime(),a=(new Date).getTime();return e.dueAt||(t=0),s.dueAt||(n=0),t<a||n<a?t<n?1:t>n?-1:0:t>n?1:t<n?-1:0}));var a=null,d=n.map((e=>{var s="";return e.dueAt?new Date(e.dueAt)<new Date?(a&&"old"!==a&&(s='<h5 style="margin: 75px 20px 10px 20px;font-weight: bold;">Old Assignments</h5>'),a="old"):a="upcoming":(a&&"undated"!==a&&(s='<h5 style="margin: 75px 20px 10px 20px;font-weight: bold;">Undated Assignments</h5>'),a="undated"),s+dtps.renderAssignment(e)})).join("");d=dtps.renderStreamTools(t,"stream")+d,dtps.selectedClass==t&&"stream"==dtps.selectedContent&&$(".classContent").html(d)}else dtps.selectedClass==t&&"stream"==dtps.selectedContent&&jQuery(".classContent").html(dtps.renderStreamTools(t,"stream")+[1,2,3,4].map((()=>'\n                    <div class="card assignment graded">\n                        <h4>\n                            <span style="width: 450px;" class="shimmer">Assignment Title</span>\n                            <div class="points shimmer">00/00</div>\n                        </h4>\n\n                        <h5 style="white-space: nowrap; overflow: hidden;">\n                            <div style="width: 200px;" class="infoChip shimmer"></div>\n                            <i class="fluid-icon statusIcon shimmer">more_horiz</i>\n                        </h5>\n                    </div>\n                ')).join(""))},dtps.assignment=function(e,s,t){var n=dtps.classes[s].assignments.map((e=>e.id)),a=dtps.classes[s].assignments[n.indexOf(e)],d=null;if(a.body){var l=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards"),i=getComputedStyle($(".card.details")[0]).getPropertyValue("--text"),o=a.body;$("body").hasClass("dark")&&(o=dtps.brightenTextForDarkMode(a.body,l));var r=!1;if(o.toLowerCase().includes("deliverable")&&o.toLowerCase().includes("instruction")&&o.toLowerCase().includes("look for")&&(r=!0),"false"!==fluid.get("pref-formatAssignmentContent")&&dtpsLMS.dtech&&r&&$("<div></div>").append(o).children("table").find("tbody tr").length>1){var c=[];$("<div></div>").append(o).children("table").find("tbody tr").toArray().forEach(((e,s)=>{var t=$(e).find("h4:first-child").text().toLowerCase();if(t){var n=$(e);n.find("h4:first-child").remove();var a=n.html();if(a){var d=null;t.includes("deliverable")&&(d="description",t="Deliverables"),t.includes("instruction")&&(d="assignment",t="Instructions"),t.includes("look for")&&(d="find_in_page",t="Look Fors"),c.push({text:t,icon:d,innerHTML:a})}}}));var p=$("<div></div>").append(o);p.children("table").replaceWith(c.map((e=>`\n                    <div class="dtpsFormattedAssignmentSection" style="margin: 20px 0px;">\n                        <h2><i style="vertical-align: middle; margin-right: 10px; font-size: 24px;" class="material-icons-outlined">${e.icon}</i><span style="vertical-align: middle;text-decoration: underline;">${e.text}</span></h2>\n                        ${e.innerHTML}\n                    </div>\n                `)).join(""));var m=p.html(),u=new Blob([`\n                    <base target="_blank" /> \n                    <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">\n                    <style>body {background-color: ${l}; color: ${i};} .dtpsFormattedAssignmentSection *:not(a) { color: ${i} !important; } .dtpsFormattedAssignmentSection * { background: none !important; }</style>\n                    ${m}\n            `],{type:"text/html"});d=`<iframe id="assignmentParts" onload="dtps.iframeLoad('assignmentParts')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${window.URL.createObjectURL(u)}" />`}else{u=new Blob([`\n                <base target="_blank" /> \n                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                <style>body {background-color: ${l}; color: ${i};}</style>\n                ${o}\n            `],{type:"text/html"});d=`<iframe id="assignmentIframe" onload="dtps.iframeLoad('assignmentIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${window.URL.createObjectURL(u)}" />`}}var v="";if(a.rubric)v=a.rubric.map((function(e){return`\n                    <div class="dtpsAssignmentRubricItem">\n                        <h5>${e.title}</h5>\n                        <div class="score">\n                            <p style="color: ${!t&&e.color?e.color:"var(--secText)"};" class="scoreName">\n                                ${t?"":void 0!==e.score?e.scoreName||"":"Not assessed"}\n\n                                <div class="points">\n                                    <p class="earned">${t?"":e.score??"-"}</p>\n                                    <p class="possible">${"/"+e.value}</p>\n                                </div>\n                            </p>\n                        </div>\n                    </div>\n                `})).join("");var g="";if(a.feedback)g=a.feedback.map((e=>`\n                    <div class="dtpsSubmissionComment">\n                        ${e.author?`\n                            <img src="${e.author.photoURL}" />\n                            <h5>${e.author.name}</h5>\n                        `:""}\n\n                        <p>${e.comment}</p>\n                    </div>\n                `)).join("");var h=dtps.renderAssignmentScore(a);$(".card.details").html(`\n            <i onclick="fluid.cards.close('.card.details'); $('.card.details').html('');" class="fluid-icon close">close</i>\n\n            <h4 style="font-weight: bold;">${a.title}</h4>\n\n            <div>\n                ${a.dueAt?`<div class="assignmentChip"><i class="fluid-icon">alarm</i><span>Due ${dtps.formatDate(a.dueAt)}</span></div>`:""}\n                ${a.turnedIn&&!t?'<div title="Assignment submitted" class="assignmentChip" style="color: #0bb75b"><i class="fluid-icon">assignment_turned_in</i></div>':""}\n                ${a.missing&&!t?'<div  title="Assignment is missing" class="assignmentChip" style="color: #c44848"><i class="fluid-icon">remove_circle_outline</i></div>':""}\n                ${a.late&&!t?'<div title="Assignment is late" class="assignmentChip" style="color: #c44848"><i class="fluid-icon">assignment_late</i></div>':""}\n                ${a.locked&&!t?'<div title="Assignment submissions are locked" class="assignmentChip" style="color: var(--secText, gray);"><i class="fluid-icon">lock_outline</i></div>':""}\n                ${dtps.user.parent&&!t?`<div class="assignmentChip"><i class="fluid-icon">person</i><span>${dtps.user.children.find((e=>e.id==dtps.classes[a.class].userID)).name}</span></div>`:""}\n                ${t?"":h}\n            </div>\n\n            <div style="margin-top: 20px;" class="assignmentBody">\n                ${a.body?d:""}\n            </div>\n\n            ${a.body?'<div style="margin: 5px 0px; background-color: var(--darker); height: 1px; width: 100%;" class="divider"></div>':""}\n\n            <div style="width: calc(40% - 2px); margin-top: 20px; display: inline-block; overflow: hidden; vertical-align: top;">\n                ${a.publishedAt?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">add_box</i> Published: ${dtps.formatDate(a.publishedAt)}</p>`:""}\n                ${a.dueAt?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">alarm</i> Due: ${dtps.formatDate(a.dueAt)}</p>`:""}\n                ${a.value?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">bar_chart</i> Point value: ${a.value}</p>`:""}\n                ${!a.grade&&0!=a.grade||t?"":`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">assessment</i> Points earned: ${a.grade}</p>`}\n                ${a.letter&&!t?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">font_download</i> Letter grade: ${a.letter}</p>`:""}\n                ${a.category?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">category</i> Category: ${a.category}</p>`:""}\n                ${a.rubric?a.rubric.map((function(e){return`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">adjust</i> ${e.title}</p>`})).join(""):""}\n                <p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">class</i> Class: ${dtps.classes[a.class].subject}</p>\n                ${"dev"==dtps.env?`<p style="color: var(--secText); margin: 5px 0px;"><i style="vertical-align: middle;" class="fluid-icon">code</i> Assignment ID: ${a.id}</p>`:""}\n\n                <br />\n                <div class="row">\n                    ${a.url?`<button class="btn small outline" onclick="window.open('${a.url}')"><i class="fluid-icon">open_in_new</i> Open in ${dtpsLMS.shortName||dtpsLMS.name}</button>`:""}\n                </div>\n            </div>\n\n            <div style="width: calc(60% - 7px); margin-top: 20px; margin-left: 5px; display: inline-block; overflow: hidden; vertical-align: middle;">\n                ${t?"":g}\n\n                ${v}\n            </div>\n        `),fluid.cards.close(".card.focus"),fluid.cards(".card.details")},dtps.moduleStream=function(e){var s=dtps.classes.map((e=>e.id)).indexOf(e);dtps.selectedClass=s,dtps.selectedContent="moduleStream",$("#dtpsTabBar .btn").removeClass("active"),$("#dtpsTabBar .btn.stream").addClass("active"),window.localStorage.setItem("courseworkPref-"+e,"moduleStream"),dtps.presentClass(s),dtps.showClasses(),-1==s&&dtps.error("The selected class doesn't exist","classNum check failed @ dtps.moduleStream"),dtps.selectedClass==s&&"moduleStream"==dtps.selectedContent&&jQuery(".classContent").html(dtps.renderStreamTools(s,"modules")+'\n            <div class="module card collapsed">\n                <h4>\n                    <i class="fluid-icon collapseIcon shimmer">star</i>\n                    <span class="shimmer">[SHIMMER] Module title (collapsed)</span>\n                </h4>\n                <div class="moduleContents" style="padding-top: 10px;"></div>\n            </div>\n            <div class="module card">\n                <h4>\n                    <i class="fluid-icon collapseIcon shimmer">star</i>\n                    <span class="shimmer">[SHIMMER] Module title</span>\n                </h4>\n        \n                <div class="moduleContents" style="padding-top: 10px;">\n                    <div class="moduleItem shimmer">[SHMMER] module item</div>\n                    <div class="moduleItem shimmer">[SHMMER] module item</div>\n                    <div class="moduleItem shimmer">[SHMMER] module item</div>\n                    <div class="moduleItem shimmer">[SHMMER] module item</div>\n                    <div class="moduleItem shimmer">[SHMMER] module item</div>\n                </div>\n            </div>\n        '),new Promise((e=>{dtps.classes[s].modules&&!0!==dtps.classes[s].modules?e(dtps.classes[s].modules):dtpsLMS.fetchModules(dtps.user.id,dtps.classes[s].lmsID).then((s=>e(s)))})).then((t=>{dtps.classes[s].modules=t;var n=dtps.renderStreamTools(s,"modules"),a=!0;t.forEach((t=>{var d="";t.collapsed||(a=!1),t.items.forEach((t=>{var n="list";"assignment"==t.type&&(n="assignment"),"page"==t.type&&(n="insert_drive_file"),"discussion"==t.type&&(n="forum"),"url"==t.type&&(n="open_in_new"),"header"==t.type&&(n="format_size"),"embed"==t.type&&(n="web");var a="";"assignment"==t.type&&(a="dtps.assignment('"+t.id+"', "+s+")"),"page"==t.type&&(a="fluid.screen('pages', '"+e+"|"+t.id+"|true')"),"discussion"==t.type&&(a="fluid.screen('discussions', '"+e+"|"+t.id+"|true')"),"url"==t.type&&(a="window.open('"+t.url+"')"),"header"==t.type&&(a=""),"embed"==t.type&&(a="dtps.showIFrameCard('"+t.url+"')"),"header"==t.type?d+=`<h5 style="font-size: 16px;padding: 0px 10px; text-decoration: underline;">${t.title}</h5>`:d+=`\n                        <div class="moduleItem" onclick="${a}" style="margin-left: ${15*t.indent}px;">\n                            <i ${t.completed?'style="color: #27ba3c"':""} class="fluid-icon">${t.completed?"check":n}</i>\n                            ${t.title}\n                        </div>\n                    `})),n+=`\n                <div class="module card ${t.collapsed?"collapsed":""}">\n                    <h4>\n                        <i onclick="dtps.moduleCollapse(this, '${dtps.classes[s].id}', '${t.id}');" \n                            class="fluid-icon collapseIcon">${t.collapsed?"keyboard_arrow_right":"keyboard_arrow_down"}</i>\n                        ${t.title}\n                    </h4>\n\n                    <div class="moduleContents" style="padding-top: 10px;">\n                        ${d}\n                    </div>\n                </div>\n            `})),0==t.length&&(n+='\n                <div style="text-align: center;">\n                    <div style="margin: 60px; padding: 20px 40px; display: inline-block; border: 2px solid var(--elements); border-radius: var(--elementRadius);">\n                        <h5>No Modules</h5>\n                        <p>There aren\'t any modules in this class yet.</p>\n                    </div>\n                </div>\n            '),dtps.selectedClass==s&&"moduleStream"==dtps.selectedContent&&($(".classContent").html(n),dtpsLMS.collapseAllModules&&($("#moduleExpandCollapse").html(a?'<i class="fluid-icon">unfold_more</i> Expand all':'<i class="fluid-icon">unfold_less</i> Collapse all'),$("#moduleExpandCollapse").attr("onclick",a?"dtps.moduleCollapseAll(false)":"dtps.moduleCollapseAll(true)"),$("#moduleExpandCollapse").show()))})).catch((e=>{dtps.error("Could not load modules","Caught promise rejection @ dtps.moduleStream",e)}))},dtps.moduleCollapse=function(e,s,t){$(e).parents(".card").toggleClass("collapsed"),$(e).parents(".card").hasClass("collapsed")?(dtpsLMS.collapseModule&&dtpsLMS.collapseModule(s,t,!0),$(e).html("keyboard_arrow_right"),dtps.classes[dtps.selectedClass].modules.find((e=>e.id==t)).collapsed=!0):(dtpsLMS.collapseModule&&dtpsLMS.collapseModule(s,t,!1),$(e).html("keyboard_arrow_down"),dtps.classes[dtps.selectedClass].modules.find((e=>e.id==t)).collapsed=!1)},dtps.moduleCollapseAll=function(e){e&&dtpsLMS.collapseAllModules?(dtpsLMS.collapseAllModules(dtps.classes[dtps.selectedClass].lmsID,!0),$(".classContent .card.module h4 i").text("keyboard_arrow_right"),$(".classContent .module.card").addClass("collapsed"),dtps.classes[dtps.selectedClass].modules.forEach((e=>e.collapsed=!0)),$("#moduleExpandCollapse").html('<i class="fluid-icon">unfold_more</i> Expand all'),$("#moduleExpandCollapse").attr("onclick","dtps.moduleCollapseAll(false)")):dtpsLMS.collapseAllModules&&(dtpsLMS.collapseAllModules(dtps.classes[dtps.selectedClass].lmsID,!1),$(".classContent .card.module h4 i").text("keyboard_arrow_down"),$(".classContent .module.card").removeClass("collapsed"),dtps.classes[dtps.selectedClass].modules.forEach((e=>e.collapsed=!1)),$("#moduleExpandCollapse").html('<i class="fluid-icon">unfold_less</i> Collapse all'),$("#moduleExpandCollapse").attr("onclick","dtps.moduleCollapseAll(true)"))},dtps.renderStreamTools=function(e,s){var t=dtps.classes[e].modules;return`\n        ${"modules"==s||"stream"==s?`\n            <div style="text-align: right;${t?"":"margin-top: 20px;"}">\n                ${t?`\n                    ${"modules"==s&&dtpsLMS.collapseAllModules?'<button id="moduleExpandCollapse" onclick="dtps.moduleCollapseAll()" style="margin-right:20px;display:none;" class="btn"></button>':""}\n                    <div class="btns row small assignmentPicker" style="margin: 5px 20px 5px 0px !important;">\n                        <button class="btn ${"stream"==s?"active":""}" onclick="fluid.screen('stream', dtps.classes[dtps.selectedClass].id);"><i class="fluid-icon">assignment</i>Assignments</button>\n                        <button class="btn ${"modules"==s?"active":""}" onclick="fluid.screen('moduleStream', dtps.classes[dtps.selectedClass].id);"><i class="fluid-icon">view_module</i>Modules</button>\n                    </div>\n                `:""}\n                \n            </div>`:""}\n    `},dtps.gradebook=function(e){var s=dtps.classes.map((e=>e.id)).indexOf(e);if(dtps.selectedClass=s,dtps.selectedContent="grades",$("#dtpsTabBar .btn").removeClass("active"),$("#dtpsTabBar .btn.grades").addClass("active"),dtps.presentClass(s),dtps.showClasses(),-1==s&&dtps.error("The selected class doesn't exist","classNum check failed @ dtps.gradebook"),dtps.selectedClass==s&&"grades"==dtps.selectedContent&&jQuery(".classContent").html('<div class="spinner"></div>'),dtps.classes[s].letter&&dtps.classes[s].assignments){var t=0,n=0,a=0,d=0,l="";dtps.classes[s].assignments.forEach((e=>{(e.grade||0==e.grade)&&(a+=e.grade,d++,l+=`\n                <div onclick="dtps.assignment('${e.id}', ${s})" class="gradebookAssignment card">\n                    <h5>\n                        ${e.title}\n\n                        <div class="stats">\n                            ${e.letter?`<div class="gradebookLetter">${e.letter}</div>`:""}\n                            <div class="gradebookScore">${e.grade}</div>\n                            <div class="gradebookValue">/${e.value}</div>\n                            <div class="gradebookPercentage">${Math.round(e.grade/e.value*100)}%</div>\n                        </div>\n                    </h5>\n                </div>\n            `),e.value&&(n+=e.value),0==e.grade&&e.value&&t++}));var i=`\n        <div style="--classColor: ${dtps.classes[s].color}" class="card">\n            <h3 class="gradeTitle">\n                Grade Summary\n                <div class="classGradeCircle">\n                    ${dtps.classes[s].grade?`<span class="percentage">${dtps.classes[s].grade}%</span>`:""}\n                    <div class="letter">${dtps.classes[s].letter||""}</div>\n                </div>\n            </h3>\n\n            ${t?`\n                <h5 style="color: #d63d3d;" class="gradeStat">\n                    Zeros\n                    <div style="color: #d63d3d;" class="numFont">${t}</div>\n                </h5>\n            `:""}\n\n            <div style="${dtps.gradebookExpanded?"":"display: none;"}" id="genericClassGradeMore">\n                <br />\n\n                ${dtps.classes[s].previousLetter?`\n                    <h5 class="smallStat">\n                        Previous Grade\n                        <div class="numFont">${dtps.classes[s].previousLetter}</div>\n                    </h5>\n                `:""}\n\n                <h5 class="smallStat">\n                    Points\n                    <div class="numFont fraction">\n                        <span class="earned">${a}</span>\n                        <span class="total">/${n}</span>\n                    </div>\n                </h5>\n\n                <h5 class="smallStat">\n                    Graded Assignments\n                    <div class="numFont">${d}</div>\n                </h5>\n            </div>\n\n            <br />\n            <a onclick="$('#genericClassGradeMore').toggle(); if ($('#genericClassGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"\n                style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded?"Show less":"Show more"}</a>\n        </div>\n\n        <br />\n    `;dtps.selectedClass==s&&"grades"==dtps.selectedContent&&$(".classContent").html(i+l)}},fluid.externalScreens.dashboard=()=>{dtps.mainStream()},fluid.externalScreens.stream=e=>{dtps.classStream(e)},fluid.externalScreens.moduleStream=e=>{dtps.moduleStream(e)},fluid.externalScreens.gradebook=e=>{dtps.gradebook(e)};
//# sourceMappingURL=/scripts/assignments.js.map