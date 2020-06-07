/**
 * @file DTPS Generic Gradebook
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 */
var gradebookExpanded=false;dtps.gradebook=function(classID){var classNum=dtps.classes.map(course=>course.id).indexOf(classID);dtps.selectedClass=classNum;dtps.selectedContent="grades";$("#dtpsTabBar .btn").removeClass("active");$("#dtpsTabBar .btn.grades").addClass("active");dtps.presentClass(classNum);dtps.showClasses();if(classNum==-1){dtps.error("The selected class doesn't exist","classNum check failed @ dtps.gradebook")}jQuery(".classContent").html(`<div class="spinner"></div>`);if(!dtps.classes[classNum].letter||!dtps.classes[classNum].assignments){return}var zeros=0;var totalPoints=0;var earnedPoints=0;var gradedAssignments=0;dtps.classes[classNum].assignments.forEach(assignment=>{if(assignment.grade||assignment.grade==0){earnedPoints+=assignment.grade;gradedAssignments++}if(assignment.value){totalPoints+=assignment.value}if(assignment.grade==0&&assignment.value){zeros++}});var gradeCalcSummary=`\n        <div style="--classColor: ${dtps.classes[classNum].color}" class="card">\n            <h3 class="gradeTitle">\n                Grade Summary\n                <div class="classGradeCircle">\n                    ${dtps.classes[classNum].grade?`<span class="percentage">${dtps.classes[classNum].grade}%</span>`:``}\n                    <div class="letter">${dtps.classes[classNum].letter||``}</div>\n                </div>\n            </h3>\n\n            ${zeros?`\n                <h5 style="color: #d63d3d;" class="gradeStat">\n                    Zeros\n                    <div style="color: #d63d3d;" class="numFont">${zeros}</div>\n                </h5>\n            `:``}\n\n            <div style="${gradebookExpanded?"":"display: none;"}" id="classGradeMore">\n                <br />\n\n                ${dtps.classes[classNum].previousLetter?`\n                    <h5 class="smallStat">\n                        Previous Grade\n                        <div class="numFont">${dtps.classes[classNum].previousLetter}</div>\n                    </h5>\n                `:``}\n\n                <h5 class="smallStat">\n                    Points\n                    <div class="numFont fraction">\n                        <span class="earned">${earnedPoints}</span>\n                        <span class="total">/${totalPoints}</span>\n                    </div>\n                </h5>\n\n                <h5 class="smallStat">\n                    Graded Assignments\n                    <div class="numFont">${gradedAssignments}</div>\n                </h5>\n            </div>\n\n            <br />\n            <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); gradebookExpanded = true;} else {$(this).html('Show more'); gradebookExpanded = false;}"\n                style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${gradebookExpanded?"Show less":"Show more"}</a>\n        </div>\n    `;$(".classContent").html(gradeCalcSummary)};fluid.externalScreens.gradebook=courseID=>{dtps.gradebook(courseID)};