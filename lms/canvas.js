/**
 * @file DTPS Canvas LMS Integration
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * JSDoc documentation for these LMS functions can be found near the end of core.js
 */
var dtpsLMS={name:"Canvas LMS",shortName:"Canvas",legalName:"Canvas LMS and Instructure Inc.",description:"Power+ integration for Canvas LMS",url:"https://www.instructure.com/canvas/",logo:"https://i.imgur.com/rGjNVoc.png",source:"https://github.com/jottocraft/dtps/blob/master/scripts/lms/canvas.js",genericGradebook:true};dtpsLMS.commonHeaders={Accept:"application/json+canvas-string-ids, application/json"};dtpsLMS.fetchUser=function(){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/users/self",type:"GET",headers:dtpsLMS.commonHeaders,success:function(userData){jQuery.ajax({url:"/api/v1/users/self/observees?include[]=avatar_url",type:"GET",headers:dtpsLMS.commonHeaders,success:function(childrenData){var user={name:userData.name,id:userData.id,photoURL:userData.avatar_url};if(childrenData&&childrenData.length){user.children=childrenData.map(child=>({name:child.name,id:child.id,photoURL:child.avatar_url}))}resolve(user)},error:function(err){reject(err)}})},error:function(err){reject(err)}})}))};dtpsLMS.fetchClasses=function(){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/users/self/colors",type:"GET",headers:dtpsLMS.commonHeaders,success:function(colorData){jQuery.ajax({url:"/api/v1/users/self/dashboard_positions",type:"GET",headers:dtpsLMS.commonHeaders,success:function(dashboardData){jQuery.ajax({url:"/api/v1/users/"+dtps.user.lmsID+"/courses?per_page=100&enrollment_state=active&include[]=term&include[]=total_scores&include[]=public_description&include[]=total_students&include[]=account&include[]=teachers&include[]=course_image&include[]=syllabus_body&include[]=tabs",type:"GET",headers:dtpsLMS.commonHeaders,success:function(courseData){var courses=[];courseData.forEach((course,index)=>{var dtpsCourse={name:course.course_code,id:course.id,subject:window.localStorage["pref-fullNames"]=="true"?course.course_code:course.course_code.split(" - ")[0],syllabus:course.syllabus_body,homepage:course.default_view=="wiki",description:course.public_description,numStudents:course.total_students,term:course.course_code.split(" - ")[1],color:colorData.custom_colors["course_"+course.id],grade:course.enrollments[0].computed_current_score,letter:course.enrollments[0].computed_current_grade,image:course.image_download_url,newDiscussionThreadURL:"/courses/"+course.id+"/discussion_topics/new",pages:course.tabs.map(tab=>tab.id).includes("pages"),modules:course.tabs.map(tab=>tab.id).includes("modules"),discussions:course.tabs.map(tab=>tab.id).includes("discussions")};if(course.teachers[0]){dtpsCourse.teacher={name:course.teachers[0]&&course.teachers[0].display_name,id:course.teachers[0]&&course.teachers[0].id,photoURL:course.teachers[0]&&course.teachers[0].avatar_image_url}}courses.push(dtpsCourse)});courses.sort((function(a,b){var keyA=dashboardData.dashboard_positions["course_"+a.id],keyB=dashboardData.dashboard_positions["course_"+b.id];if(keyA<keyB)return-1;if(keyA>keyB)return 1;return 0}));courses.forEach((course,index)=>course.num=index);resolve(courses)},error:function(err){reject(err)}})},error:function(err){reject(err)}})},error:function(err){reject(err)}})}))};dtpsLMS.fetchAssignments=function(classID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/students/submissions?include[]=rubric_assessment&include[]=submission_comments&per_page=100&student_ids[]="+dtps.user.lmsID,type:"GET",headers:dtpsLMS.commonHeaders,success:function(submissionData){jQuery.ajax({url:"/api/v1/users/"+dtps.user.lmsID+"/courses/"+classID+"/assignments?per_page=100&include[]=submission",type:"GET",headers:dtpsLMS.commonHeaders,success:function(assignmentData){var assignments=[];assignmentData.forEach((assignment,index)=>{var dtpsAssignment={title:assignment.name,body:assignment.description,id:assignment.id,dueAt:assignment.due_at,url:assignment.html_url,locked:assignment.locked_for_user,publishedAt:assignment.created_at,value:assignment.points_possible};var temporaryScoreNames={};if(assignment.rubric){assignment.rubric.forEach(canvasRubric=>{if(!dtpsAssignment.rubric)dtpsAssignment.rubric=[];dtpsAssignment.rubric.push({title:canvasRubric.description,description:canvasRubric.long_description,id:canvasRubric.id,value:canvasRubric.points,outcome:canvasRubric.outcome_id,assignmentTitle:assignment.name,assignmentID:assignment.id});temporaryScoreNames[canvasRubric.id]={};canvasRubric.ratings.forEach(canvasRating=>{temporaryScoreNames[canvasRubric.id][canvasRating.points]=canvasRating.description})})}submissionData.forEach(submission=>{if(submission.assignment_id==assignment.id){if(submission.rubric_assessment){dtpsAssignment.rubric.forEach(rubric=>{if(submission.rubric_assessment[rubric.id]){rubric.score=submission.rubric_assessment[rubric.id].points;rubric.scoreName=temporaryScoreNames[rubric.id][rubric.score]}})}dtpsAssignment.turnedIn=submission.submission_type!==null;dtpsAssignment.late=submission.late;dtpsAssignment.missing=submission.missing;dtpsAssignment.gradedAt=submission.graded_at;dtpsAssignment.grade=submission.score;if(isNaN(submission.grade))dtpsAssignment.letter=submission.grade;if(submission.submission_comments){dtpsAssignment.feedback=[];submission.submission_comments.forEach(comment=>{var feedback={comment:comment.comment};if(comment.author){feedback.author={name:comment.author.display_name,id:comment.author.id,photoURL:comment.author.avatar_image_url}}dtpsAssignment.feedback.push(feedback)})}}});assignments.push(dtpsAssignment)});resolve(assignments)},error:function(err){reject(err)}})},error:function(err){reject(err)}})}))};dtpsLMS.fetchModules=function(classID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/modules?include[]=items&include[]=content_details",type:"GET",headers:dtpsLMS.commonHeaders,success:function(modulesData){jQuery.ajax({url:"/courses/"+classID+"/modules/progressions",type:"GET",headers:dtpsLMS.commonHeaders,success:function(progressionData){var collapsedModules={};progressionData.forEach(prog=>{collapsedModules[prog.context_module_progression.context_module_id]=prog.context_module_progression.collapsed});var dtpsModules=modulesData.map(module=>{var moduleItems=[];module.items.forEach(item=>{if(item.type.toUpperCase()=="ASSIGNMENT"){moduleItems.push({type:"assignment",title:item.title,id:item.content_id,indent:item.indent})}else if(item.type.toUpperCase()=="PAGE"){moduleItems.push({type:"page",title:item.title,id:item.page_url,indent:item.indent})}else if(item.type.toUpperCase()=="DISCUSSION"){moduleItems.push({type:"discussion",title:item.title,id:item.content_id,indent:item.indent})}else if(item.type.toUpperCase()=="EXTERNALURL"){moduleItems.push({type:"url",title:item.title,url:item.external_url,indent:item.indent})}else if(item.type.toUpperCase()=="EXTERNALTOOL"){moduleItems.push({type:"embed",title:item.title,url:item.html_url,indent:item.indent})}else if(item.type.toUpperCase()=="SUBHEADER"){moduleItems.push({type:"header",title:item.title,indent:item.indent})}});return{id:module.id,title:module.name,collapsed:collapsedModules[module.id]||false,items:moduleItems}});resolve(dtpsModules)},error:function(err){reject(err)}})},error:function(err){reject(err)}})}))};dtpsLMS.collapseModule=function(classID,modID,collapsed){return new Promise((function(resolve,reject){jQuery.ajax({url:"/courses/"+classID+"/modules/"+modID+"/collapse",type:"POST",headers:{Accept:"application/json, text/javascript, application/json+canvas-string-ids, */*; q=0.01","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-CSRF-Token":decodeURIComponent(document.cookie).split("_csrf_token=")[1].split(";")[0]},body:"_method=POST&collapse="+(collapsed?1:0)+"&authenticity_token="+decodeURIComponent(document.cookie).split("_csrf_token=")[1].split(";")[0],success:function(data){resolve()},error:function(err){reject(err)}})}))};dtpsLMS.fetchAnnouncements=function(classID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/announcements?context_codes[]=course_"+classID,type:"GET",headers:dtpsLMS.commonHeaders,success:function(data){var dtpsAnnouncements=data.map((function(announcement){return{title:announcement.title,postedAt:announcement.created_at,body:announcement.message}}));resolve(dtpsAnnouncements)},error:function(err){reject(err)}})}))};dtpsLMS.fetchHomepage=function(classID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/front_page",type:"GET",headers:dtpsLMS.commonHeaders,success:function(data){resolve(data.body)},error:function(err){reject(err)}})}))};dtpsLMS.fetchDiscussionThreads=function(classID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/discussion_topics",type:"GET",headers:dtpsLMS.commonHeaders,success:function(data){var dtpsDiscussionThreads=data.map((function(thread){return{title:thread.title,id:thread.id,locked:thread.locked_for_user,requireInitialPost:thread.require_initial_post}}));resolve(dtpsDiscussionThreads)},error:function(err){reject(err)}})}))};dtpsLMS.fetchDiscussionPosts=function(classID,threadID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/discussion_topics/"+threadID+"/",type:"GET",headers:dtpsLMS.commonHeaders,success:function(threadData){if(threadData.group_topic_children&&threadData.group_topic_children.length){jQuery.ajax({url:"/api/v1/courses/"+classID+"/groups?only_own_groups=true",type:"GET",headers:dtpsLMS.commonHeaders,success:function(groupData){var myGroups=groupData.map(group=>group.id);var groupID=null;var groupDiscussionID=null;threadData.group_topic_children.forEach(group=>{if(myGroups.includes(group.group_id)){groupID=group.group_id;groupDiscussionID=group.id}});if(!groupID||!groupDiscussionID){jQuery.ajax({url:"/api/v1/courses/"+classID+"/discussion_topics/"+threadID+"/view",type:"GET",headers:dtpsLMS.commonHeaders,success:function(responsesData){parseResponse(responsesData,"/courses/"+classID+"/discussion_topics/"+threadID)},error:function(err){reject(err)}})}else{jQuery.ajax({url:"/api/v1/groups/"+groupID+"/discussion_topics/"+groupDiscussionID+"/view",type:"GET",headers:dtpsLMS.commonHeaders,success:function(responsesData){parseResponse(responsesData,"/groups/"+groupID+"/discussion_topics/"+groupDiscussionID)},error:function(err){reject(err)}})}},error:function(err){reject(err)}})}else{jQuery.ajax({url:"/api/v1/courses/"+classID+"/discussion_topics/"+threadID+"/view",type:"GET",headers:dtpsLMS.commonHeaders,success:function(responsesData){parseResponse(responsesData,"/courses/"+classID+"/discussion_topics/"+threadID)},error:function(err){reject(err)}})}function parseResponse(responsesData,baseURL){var dtpsDiscussionPosts=[];var initialPost={id:threadID,body:threadData.message,postedAt:threadData.created_at,replyURL:baseURL};if(threadData.author&&threadData.author.display_name){initialPost.author={name:threadData.author.display_name,id:threadData.author.id,photoURL:threadData.author.avatar_image_url}}dtpsDiscussionPosts.push(initialPost);if(responsesData.view){var people={};if(responsesData.participants){responsesData.participants.forEach(participant=>{people[participant.id]=participant})}responsesData.view.forEach((function(post){if(!post.deleted){var replies=[];if(post.replies){function addReplies(arr,depth){arr.forEach(reply=>{if(!reply.deleted){var dtpsReply={id:reply.id,body:reply.message,postedAt:reply.created_at,replyURL:baseURL+"/entry-"+reply.id,depth:depth};if(people[reply.user_id]){dtpsReply.author={name:people[reply.user_id].display_name,id:reply.user_id,photoURL:people[reply.user_id].avatar_image_url}}replies.push(dtpsReply)}if(reply.replies)addReplies(reply.replies,depth+1)})}addReplies(post.replies,0)}var dtpsPost={id:post.id,body:post.message,postedAt:post.created_at,replies:replies,replyURL:baseURL+"/entry-"+post.id};if(people[post.user_id]){dtpsPost.author={name:people[post.user_id].display_name,id:post.user_id,photoURL:people[post.user_id].avatar_image_url}}dtpsDiscussionPosts.push(dtpsPost)}}))}resolve(dtpsDiscussionPosts)}},error:function(err){reject(err)}})}))};dtpsLMS.fetchPages=function(classID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/pages?per_page=100",type:"GET",headers:dtpsLMS.commonHeaders,success:function(data){var dtpsPages=data.map((function(page){var dtpsPage={title:page.title,id:page.url,updatedAt:page.updated_at};if(page.last_edited_by){dtpsPage.author={name:page.last_edited_by.display_name,id:page.last_edited_by.id,photoURL:page.last_edited_by.avatar_image_url}}return dtpsPage}));resolve(dtpsPages)},error:function(err){reject(err)}})}))};dtpsLMS.fetchPageContent=function(classID,pageID){return new Promise((function(resolve,reject){jQuery.ajax({url:"/api/v1/courses/"+classID+"/pages/"+pageID,type:"GET",headers:dtpsLMS.commonHeaders,success:function(data){resolve(data.body)},error:function(err){reject(err)}})}))};var baseURL=document.currentScript.src.split("/")[0]+"//"+document.currentScript.src.split("/")[2];jQuery.getScript(baseURL+"/scripts/core.js");
//# sourceMappingURL=/scripts/lms/canvas.js.map