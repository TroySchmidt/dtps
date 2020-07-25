/**
 * @file DTPS pages & discussion functions
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */
dtps.loadThreadsList=function(courseID,defaultThread){var classNum=dtps.classes.map(course=>course.id).indexOf(courseID);dtps.selectedClass=classNum;dtps.selectedContent="discuss";$("#dtpsTabBar .btn").removeClass("active");$("#dtpsTabBar .btn.discuss").addClass("active");if(classNum==-1){dtps.error("The selected class doesn't exist","classNum check failed @ dtps.loadThreadsList")}dtps.presentClass(classNum);jQuery("body").removeClass("collapsedSidebar");if(dtps.selectedClass==classNum&&dtps.selectedContent=="discuss"){jQuery(".sidebar").html(`\n            <div class="bigLogo" style="text-align: center; margin: 10px 0 20px; height: 38px;">\n                <i style="font-size: 28px; margin-right: 7px; vertical-align: middle;" class="material-icons">forum</i>\n                <h4 style="color: var(--text); display: inline-block; font-size: 28px; vertical-align: middle; margin: 0px;">Discussions</h4>\n            </div>\n                        \n            <div class="items">\n                <div class="spinner"></div>\n            </div>\n        `);jQuery(".classContent").html("")}dtpsLMS.fetchDiscussionThreads(dtps.classes[classNum].id).then((function(threadData){dtps.classes[classNum].discussions=threadData;if(dtps.classes[classNum].discussions.length==0){jQuery(".sidebar .items").html(`\n                <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">\n                    <span class="label">Classes</span>\n                    <div class="icon">\n                        <i class="material-icons">keyboard_arrow_left</i>\n                    </div>\n                </div>\n\n                <p style="text-align: center; font-weight: bold; margin-top: 60px;">No discussions found</p>\n                <p style="text-align: center; font-size: 14px;">This class doesn't have any discussions</p>\n            `)}else{var discussionHTML=dtps.classes[classNum].discussions.map(discussionThread=>`\n                    <div data-threadID="${discussionThread.id}" class="item">\n                        <span class="label">${discussionThread.title}</span>\n                        <div class="icon">\n                            <i style="font-family: 'Material Icons Extended';" class="material-icons">${discussionThread.locked?"lock_outline":"chat_bubble_outline"}</i>\n                        </div>\n                    </div>\n                `).join("");if(dtps.selectedClass==classNum&&dtps.selectedContent=="discuss"){jQuery(".sidebar .items").html(`\n                    <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">\n                        <span class="label">Classes</span>\n                        <div class="icon">\n                            <i class="material-icons">keyboard_arrow_left</i>\n                        </div>\n                    </div>\n\n                    ${dtps.classes[classNum].newDiscussionThreadURL?`\n                            <div onclick="window.open('${dtps.classes[classNum].newDiscussionThreadURL}')" class="class item back">\n                                <span class="label">New discussion</span>\n                                <div class="icon">\n                                    <i class="material-icons">add</i>\n                                </div>\n                            </div>\n                        `:""}\n\n                    <div class="divider"></div>\n\n                    ${discussionHTML}\n                `)}if(defaultThread){dtps.loadThreadPosts(classNum,defaultThread)}$(".sidebar .item:not(.back)").click((function(event){$(this).siblings().removeClass("active");$(this).addClass("active");var postID=$(this).attr("data-threadID");dtps.loadThreadPosts(classNum,postID)}))}})).catch((function(err){dtps.error("Couldn't fetch discussion threads","Caught promise rejection @ dtps.loadThreadsList",err)}))};dtps.loadThreadPosts=function(classNum,threadID){if(dtps.selectedClass==classNum&&dtps.selectedContent=="discuss"){jQuery(".classContent").html(`<div class="spinner"></div>`)}var thread=null;dtps.classes[classNum].discussions.forEach(discussionThread=>{if(discussionThread.id==threadID){thread=discussionThread}});if(!thread){dtps.error("Thread does not exist","thread is null @ dtps.loadThreadPosts");throw null}dtpsLMS.fetchDiscussionPosts(dtps.classes[classNum].id,threadID).then((function(postData){thread.posts=postData;var postHTML=[];thread.posts.forEach((post,index)=>{var computedBackgroundColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");var computedTextColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--text");var blob=new Blob([`\n                    <base target="_blank" /> \n                    <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                    <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>\n                    ${post.body}\n                `],{type:"text/html"});var discussionPostContentURL=window.URL.createObjectURL(blob);var replyHTML=[];if(post.replies){replyHTML.push(`<br />`);post.replies.forEach(reply=>{replyHTML.push(`\n                        <div style="margin-left: ${(reply.depth||0)*50}px;" class="discussionReply">\n                            <div class="discussionHeader">\n                                ${post.author?`\n                                    <img src="${reply.author.photoURL}" />\n                                    <h5>${reply.author.name}</h5>\n                                `:``}\n                                \n                                <span style="cursor: pointer;" onclick="window.open('${reply.replyURL}')">\n                                    <i class="material-icons">reply</i>\n                                    <span>Reply</span>\n                                </span>\n                            </div>\n\n                            ${reply.body}\n                        </div>\n                    `)});replyHTML.push(`<br />`)}postHTML.push(`\n                    <div class="card" style="margin-top: 20px;${index==0?"margin-bottom: 75px;":"padding: 20px 30px;"}">\n                        \x3c!-- Thread title (Initial post) --\x3e\n                        ${index==0?`\n                            <h4 style="font-weight: bold">${thread.title}</h4>\n                        `:""}\n\n                        \x3c!-- Author header --\x3e\n                        <div ${index==0?`style="margin-bottom: 32px;"`:""} class="discussionHeader">\n                            ${post.author?`\n                                <img src="${post.author.photoURL}" />\n                                <h5>${post.author.name}</h5>\n                            `:``}\n\n                            <i class="material-icons">calendar_today</i>\n                            <span>${dtps.formatDate(post.postedAt)}</span>\n\n                            \x3c!-- Thread info (initial post) --\x3e\n                            ${index==0?`\n                                ${thread.locked?`<i class="material-icons">lock</i>`:""}\n                                ${thread.requireInitialPost?`\n                                    <i class="material-icons">visibility</i>\n                                    <span>You must post before you can see other replies</span>\n                                `:""}\n                            `:""}\n                        </div>\n         \n                        ${post.body}\n\n                        ${replyHTML.join("")}\n\n                        \x3c!-- Reply / Add post footer --\x3e\n                        ${post.replyURL?`\n                            <div ${index==0?`style="margin-top: 32px;"`:""} class="discussionFooter">\n                                ${index==0?`\n                                    <button onclick="window.open('${post.replyURL}')" class="btn small"><i class="material-icons">post_add</i> Add Post</button>\n                                `:`\n                                    <button onclick="window.open('${post.replyURL}')" class="btn small"><i class="material-icons">reply</i> Reply</button>\n                                `}\n                            </div> \n                        `:""}\n                    </div>\n                `)});jQuery(".classContent").html(postHTML.join(""))})).catch((function(err){dtps.error("Could not fetch discussion posts","Caught promise rejection @ dtps.loadThreadPosts",err)}))};dtps.loadPagesList=function(courseID,defaultPage){var classNum=dtps.classes.map(course=>course.id).indexOf(courseID);dtps.selectedClass=classNum;dtps.selectedContent="pages";$("#dtpsTabBar .btn").removeClass("active");$("#dtpsTabBar .btn.pages").addClass("active");if(classNum==-1){dtps.error("The selected class doesn't exist","classNum check failed @ dtps.loadPagesList")}dtps.presentClass(classNum);jQuery("body").removeClass("collapsedSidebar");if(dtps.selectedClass==classNum&&dtps.selectedContent=="pages"){jQuery(".sidebar").html(`\n            <div class="bigLogo" style="text-align: center; margin: 10px 0 20px; height: 38px;">\n                <i style="font-size: 28px; margin-right: 7px; vertical-align: middle;" class="material-icons">insert_drive_file</i>\n                <h4 style="color: var(--text); display: inline-block; font-size: 28px; vertical-align: middle; margin: 0px;">Pages</h4>\n            </div>\n                        \n            <div class="items">\n                <div class="spinner"></div>\n            </div>\n        `);jQuery(".classContent").html("")}dtpsLMS.fetchPages(dtps.classes[classNum].id).then((function(pagesData){dtps.classes[classNum].pages=pagesData;if(pagesData.length==0){jQuery(".sidebar .items").html(`\n                <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">\n                    <span class="label">Classes</span>\n                    <div class="icon">\n                        <i class="material-icons">keyboard_arrow_left</i>\n                    </div>\n                </div>\n\n                <p style="text-align: center; font-weight: bold; margin-top: 60px;">No pages found</p>\n                <p style="text-align: center; font-size: 14px;">This class doesn't have any pages</p>\n            `)}else{var pageHTML=dtps.classes[classNum].pages.map(page=>`\n                    <div data-pageID="${page.id}" class="item ${defaultPage&&page.id==defaultPage?"active":""}">\n                        <span class="label">${page.title}</span>\n                        <div class="icon">\n                            <i class="material-icons">insert_drive_file</i>\n                        </div>\n                    </div>\n                `).join("");if(dtps.selectedClass==classNum&&dtps.selectedContent=="pages"){jQuery(".sidebar .items").html(`\n                    <div onclick="fluid.screen('stream', '${dtps.classes[classNum].id}');" class="class item main back">\n                        <span class="label">Classes</span>\n                        <div class="icon">\n                            <i class="material-icons">keyboard_arrow_left</i>\n                        </div>\n                    </div>\n\n                    <div class="divider"></div>\n\n                    ${pageHTML}\n                `)}if(defaultPage){dtps.loadPage(classNum,defaultPage)}$(".sidebar .item:not(.back)").click((function(event){$(this).siblings().removeClass("active");$(this).addClass("active");var pageID=$(this).attr("data-pageID");dtps.loadPage(classNum,pageID)}))}})).catch(err=>{dtps.error("Couldn't fetch pages","Caught promise rejection @ dtps.loadPagesList",err)})};dtps.loadPage=function(classNum,pageID){if(dtps.selectedClass==classNum&&dtps.selectedContent=="pages"){jQuery(".classContent").html(`<div class="spinner"></div>`)}var page=null;dtps.classes[classNum].pages.forEach(pageCheck=>{if(pageCheck.id==pageID){page=pageCheck}});if(!page){dtps.error("Page does not exist","page is null @ dtps.loadPage");throw null}dtpsLMS.fetchPageContent(dtps.classes[classNum].id,page.id).then((function(pageContentData){page.content=pageContentData;if(dtps.classes[dtps.selectedClass].id==dtps.classes[classNum].id&&dtps.selectedContent=="pages"){var computedBackgroundColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--cards");var computedTextColor=getComputedStyle($(".card.details")[0]).getPropertyValue("--text");var blob=new Blob([`\n                <base target="_blank" /> \n                <link type="text/css" rel="stylesheet" href="https://cdn.jottocraft.com/CanvasCSS.css" media="screen,projection"/>\n                <style>body {background-color: ${computedBackgroundColor}; color: ${computedTextColor};</style>\n                ${page.content}\n            `],{type:"text/html"});var pageContentURL=window.URL.createObjectURL(blob);jQuery(".classContent").html(`\n                <div class="card">\n                    \x3c!-- Page title --\x3e\n                    <h4 style="font-weight: bold;">${page.title}</h4>\n\n                    \x3c!-- Page header --\x3e\n                    <div style="margin-bottom: 32px;" class="discussionHeader">\n                        ${page.author?`\n                            <img src="${page.author.photoURL}" />\n                            <h5>${page.author.name}</h5>\n                        `:``}\n\n                        <i class="material-icons">calendar_today</i>\n                        <span>${"Last Updated "+dtps.formatDate(page.updatedAt)}</span>\n                    </div>\n\n                    \x3c!-- Page content --\x3e\n                    <br />\n                    <iframe id="classPageIframe" onload="dtps.iframeLoad('classPageIframe')" style="margin: 10px 0px; width: 100%; border: none; outline: none;" src="${pageContentURL}" />\n                </div>\n            `)}})).catch(err=>{dtps.error("Couldn't load page","Caught promise rejection @ dtps.loadPage",err)})};fluid.externalScreens.discussions=param=>{var courseID=param.split("|")[0];var threadID=param.split("|")[1];dtps.loadThreadsList(courseID,threadID)};fluid.externalScreens.pages=param=>{var courseID=param.split("|")[0];var pageID=param.split("|")[1];dtps.loadPagesList(courseID,pageID)};
//# sourceMappingURL=/scripts/pages-discussions.js.map