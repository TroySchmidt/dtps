/**
 * @file d.tech-specific features, CBL & grade calculation
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * JSDoc documentation for these LMS functions can be found near the end of core.js
 */
var baseURL=document.currentScript.src.split("/")[0]+"//"+document.currentScript.src.split("/")[2];jQuery.getScript(baseURL+"/scripts/lms/canvas.js",(function(){dtpsLMS.name="d.tech";dtpsLMS.legalName="Canvas LMS, Design Tech High School, and Instructure Inc";dtpsLMS.description="Power+ integration for Canvas LMS, customized for d.tech";dtpsLMS.logo="https://i.imgur.com/efGrLq3.png";dtpsLMS.source="https://github.com/jottocraft/dtps/blob/master/scripts/lms/dtech.js";dtpsLMS.useRubricGrades=true;dtpsLMS.institutionSpecific=true;dtpsLMS.genericGradebook=false;dtpsLMS.updateAssignments=function(rawAssignments){return new Promise((resolve,reject)=>{var updatedAssignments=rawAssignments.map(assignment=>{if(assignment.rubric){assignment.rubric.forEach(rubricItem=>{rubricItem.scoreName=shortenDtechRubricScoreName(rubricItem.scoreName);if(rubricItem.score){rubricItem.color=dtechRubricColor(rubricItem.score)}})}return assignment});resolve(updatedAssignments)})};dtpsLMS.updateClasses=function(classes){return new Promise((resolve,reject)=>{var promises=[];classes.forEach(course=>{if(course.homepage){promises.push(new Promise((resolve,reject)=>{dtpsLMS.fetchHomepage(course.id).then(homepage=>{var matches=0;for(var i=0;i<$(homepage).find("a").length;i++){var link=$($(homepage).find("a")[i]);if(link.attr("alt")&&link.attr("alt").toUpperCase().includes("ZOOM BUTTON")&&link.attr("href")){course.videoMeetingURL=link.attr("href")}else if(link.attr("href")&&link.attr("href").includes("zoom.us")){course.videoMeetingURL=link.attr("href")}}if(matches>1){course.videoMeetingURL=null}resolve()})}))}});Promise.all(promises).then(()=>{resolve(classes)})})};dtpsLMS.calculateGrade=function(course,assignments){var formula=null;if(course.term=="20-21"){return;formula="2020s1"}else if(course.id=="630"){formula="2020s1"}if(!formula)return;var dtechResults=dtechGradeCalc.run(assignments,formula);if(dtechResults){return{letter:dtechResults.results.letter,dtech:dtechResults}}else{return}};var shortenDtechRubricScoreName=function(rating){if(String(rating).toUpperCase().includes("PIONEERING"))return"Pioneering";if(String(rating).toUpperCase().includes("PROFICIENT"))return"Proficient";if(String(rating).toUpperCase().includes("DEVELOPING"))return"Developing";if(String(rating).toUpperCase().includes("EMERGING"))return"Emerging";if(!String(rating).includes(" ")&&String(rating).length<=20)return rating;return""};var dtechRubricColor=function(score){if(score>=4)return"#4f9e59";if(score>=3)return"#a1b553";if(score>=2)return"#c26d44";if(score>=1)return"#c4474e";if(score>=0)return"#bd3139"};var dtechGradeCalc={letters:["A","A-","B+","B","B-","C","I"],params:{"2020s1":{percentage:{A:3.3,"A-":3.3,"B+":2.6,B:2.6,"B-":2.6,C:2.2,I:0},lowest:{A:3,"A-":2.5,"B+":2.2,B:1.8,"B-":1.5,C:1.5,I:0}}},average:function(array){var sum=0;array.forEach(item=>sum+=item);return sum/array.length},run:function(assignments,formula,outcomesOverride){var gradeVariations=[];var outcomes=outcomesOverride||{};if(formula=="2020s1"){if(!outcomesOverride){assignments.forEach(assignment=>{if(assignment.rubric){assignment.rubric.forEach(rubricItem=>{if(rubricItem.score&&rubricItem.outcome){if(!outcomes[rubricItem.outcome]){outcomes[rubricItem.outcome]={scores:[]}}outcomes[rubricItem.outcome].scores.push(rubricItem);if(rubricItem.title)outcomes[rubricItem.outcome].title=rubricItem.title}})}})}if(Object.keys(outcomes).length==0)return;Object.values(outcomes).forEach(outcome=>{var outcomeScores=outcome.scores.map(RubricItem=>RubricItem.score);var average=this.average(outcomeScores);var lowestScore=Math.min(...outcomeScores);var droppedArray=outcomeScores.slice();droppedArray.splice(droppedArray.indexOf(lowestScore),1);var droppedAverage=this.average(droppedArray);if(droppedAverage>average){outcome.scoreType="dropped";outcome.droppedScore=outcomeScores.indexOf(lowestScore);outcome.average=droppedAverage}else{outcome.scoreType="all";outcome.average=average;delete outcome.droppedScore}});var outcomeAvgs=Object.values(outcomes).map(outcome=>outcome.average);gradeVariations.push(this.getLetter(outcomeAvgs,formula,"all"))}var bestVariation=null;gradeVariations.forEach(variation=>{if(!bestVariation||this.letters.indexOf(variation.letter)<this.letters.indexOf(bestVariation.letter)){bestVariation=variation}});return{results:bestVariation,formula:formula,outcomes:outcomes}},getLetter:function(outcomeAvgs,formula,variation){var parameters={};outcomeAvgs.sort((a,b)=>b-a);if(formula=="2020s1"){var letters=[];var percentage=.75;var numOutcomesRequired=Math.floor(outcomeAvgs.length*percentage);if(outcomeAvgs.length==1){parameters.number75=outcomeAvgs[0]}else{parameters.number75=outcomeAvgs[numOutcomesRequired-1]}parameters.number75thresh=numOutcomesRequired;var bestLetter=null;for(var i=0;i<this.letters.length;i++){let letter=this.letters[i];if(parameters.number75>=this.params[formula].percentage[letter]){bestLetter=letter;break}}letters.push(bestLetter);var bestLetter=null;parameters.lowestScore=outcomeAvgs[outcomeAvgs.length-1];for(var i=0;i<this.letters.length;i++){let letter=this.letters[i];if(parameters.lowestScore>=this.params[formula].lowest[letter]){bestLetter=letter;break}}letters.push(bestLetter)}var letterIndexes=letters.map(letter=>this.letters.indexOf(letter));var lowestLetterIndex=Math.max(...letterIndexes);var letter=this.letters[lowestLetterIndex];return{letter:letter,parameters:parameters,variation:variation}}};dtpsLMS.gradebook=function(course){return new Promise((resolve,reject)=>{if(course.gradeCalculation&&course.gradeCalculation.dtech){if(course.gradeCalculation.dtech.formula=="2020s1"){var gradeCalcSummary=`\n                    <div style="--classColor: ${course.color}" class="card">\n\n                        <h3 class="gradeTitle">\n                            Grades\n\n                            <div class="classGradeCircle">\n                                <div class="letter">${course.letter}</div>\n                            </div>\n\n                        </h3>\n\n                        <h5 class="gradeStat">\n                            75% (rounded down) of outcome scores are ≥\n                            <div class="numFont">${course.gradeCalculation.dtech.results.parameters.number75.toFixed(1)}</div>\n                        </h5>\n\n                        <h5 class="gradeStat">\n                            No outcome scores are lower than\n                            <div class="numFont">${course.gradeCalculation.dtech.results.parameters.lowestScore.toFixed(1)}</div>\n                        </h5>\n\n                        <div style="${dtps.gradebookExpanded?"":"display: none;"}" id="classGradeMore">\n                            <br />\n\n                            ${course.previousLetter?`\n                            <h5 class="smallStat">\n                                Previous Grade\n                                <div class="numFont">${course.previousLetter}</div>\n                            </h5>\n                            `:``}\n\n                            ${course.gradeCalculation.dtech.results.parameters.number75thresh?`\n                            <h5 class="smallStat">\n                                75% of outcomes (rounded down) is\n                                <div class="numFont">${course.gradeCalculation.dtech.results.parameters.number75thresh}</div>\n                            </h5>\n                            `:``}\n                        \n                            <br />\n\n                            <table class="u-full-width dtpsTable">\n                                <thead>\n                                    <tr>\n                                    <th>&nbsp;&nbsp;Final Letter</th>\n                                    <th>75% (rounded down) of outcome scores is ≥</th>\n                                    <th>No outcome scores below</th>\n                                    </tr>\n                                </thead>\n\n                                <tbody>\n                                    ${dtechGradeCalc.letters.map(letter=>`\n                                            <tr ${course.letter==letter?`style="background-color: var(--classColor); color: white; font-size:20px; font-weight: bold;"`:``}>\n                                                <td>&nbsp;&nbsp;${letter}</td>\n                                                <td>${dtechGradeCalc.params[course.gradeCalculation.dtech.formula].percentage[letter]}</td>\n                                                <td>${dtechGradeCalc.params[course.gradeCalculation.dtech.formula].lowest[letter]}</td>\n                                            </tr>\n                                        `).join("")}\n                                </tbody>\n                            </table>\n                        </div>\n\n                        <br />\n\n                        <br />\n                        <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"\n                            style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded?"Show less":"Show more"}</a>\n                        <a style="color: var(--secText, gray);">Using 2020-21 grade calculation</a>\n                    </div>\n                `}else{var gradeCalcSummary=""}var outcomeHTML=[];var dividerAdded=false;Object.keys(course.gradeCalculation.dtech.outcomes).sort((function(a,b){var keyA=course.gradeCalculation.dtech.outcomes[a].average,keyB=course.gradeCalculation.dtech.outcomes[b].average;if(keyA==undefined){keyA=999999-course.gradeCalculation.dtech.outcomes[a].scores.length}if(keyB==undefined){keyB=999999-course.gradeCalculation.dtech.outcomes[b].scores.length}if(keyA>keyB)return 1;if(keyA<keyB)return-1;return 0})).forEach(outcomeID=>{var outcome=course.gradeCalculation.dtech.outcomes[outcomeID];var divider=!dividerAdded&&!outcome.scores.length;if(divider)dividerAdded=true;outcomeHTML.push(`\n                    ${divider?`<h5 style="font-weight: bold;margin: 75px 75px 10px 75px;">Unassesed outcomes</h5>`:""}\n\n                    <div style="border-radius: 20px;padding: 22px; padding-bottom: 20px;" class="card outcomeResults outcome-${outcomeID}">\n                        <h5 style="max-width: calc(100% - 50px); font-size: 24px; margin: 0px; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;">${outcome.title}</h5>\n\n                        ${outcome.average!==undefined?`\n                            <div id="outcomeScore${outcomeID}" style="position: absolute; top: 20px; right: 20px; font-size: 26px; font-weight: bold; display: inline-block; color: ${dtechRubricColor(outcome.average)}">${outcome.average.toFixed(2)}</div>\n                        `:``}\n                        \n                        <div class="assessments">\n                            ${outcome.scores.length==0?`\n                                    <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px; color: var(--secText);">This outcome has not been assessed yet</p>\n                            `:outcome.scores.map((assessment,aIndex)=>`\n                                        <p id="outcome${assessment.outcome}assessment${aIndex}" class="${aIndex==outcome.droppedScore?"dropped":""}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">\n                                            <span aIndex="${aIndex}" outcomeID="${outcomeID}"\n                                                style="outline: none;margin-right: 5px; font-size: 20px; vertical-align: middle; color: ${assessment.color}" class="editableScore" contenteditable>${assessment.score}</span>\n                                            <span class="assessmentTitle" style="cursor: pointer;" onclick="dtps.assignment('${assessment.assignmentID}', ${course.num});">${assessment.assignmentTitle}</span>\n                                        </p>\n                                    `).join("")}\n                        </div>\n\n                        <p class="addWhatIf" outcomeID="${outcomeID}" style="font-size: 14px; color: var(--secText); margin: 0px; margin-top: 16px; cursor: pointer;">\n                            <i style="cursor: pointer; vertical-align: middle; font-size: 16px;" class="material-icons down">add_box</i>\n                            Add a What-If grade\n                        </p>\n                    </div>\n                `)});var whatIfResults=`\n                    <div style="--classColor: ${course.color}" class="card" id="whatIfResults">\n                        <div style="display: inline-block;">\n                           <h5>\n                              What-If Grade\n                              <div class="resultLetter">--</div>\n                           </h5>\n                           <p style="color: var(--lightText);" class="resultPercentage"></p>\n                           <p>This grade is hypothetical and does not represent your actual grade for this class.</p>\n                           <p onclick="fluid.screen();" style="color: var(--secText); cursor: pointer;">Show actual grades</p>\n                        </div>\n                    </div>\n                `;resolve(whatIfResults+gradeCalcSummary+`<br />`+outcomeHTML.join(""))}else{resolve()}})};dtpsLMS.gradebookDidRender=function(course){$(".card.outcomeResults .assessments .editableScore").toArray().forEach(ele=>{listenForWhatIf(ele,course)});$("p.addWhatIf").click((function(){addWhatIf(course,$(this).attr("outcomeID"))}))};var listenForWhatIf=function(ele,course){ele.addEventListener("input",(function(){initWhatIf(course);var typedScore=Number($(ele).text());if($(ele).text()&&$(ele).text().length<4&&!isNaN(typedScore)&&typedScore>=1&&typedScore<=4){$(ele).css("color",dtechRubricColor(typedScore));course.gradeCalculation.dtech.whatIfOutcomes[Number($(ele).attr("outcomeID"))].scores[Number($(ele).attr("aIndex"))].score=typedScore;calcWhatIf(course)}else{$(ele).css("color","var(--secText)");$("#outcomeScore"+Number($(ele).attr("outcomeID"))).html("--");$("#outcomeScore"+Number($(ele).attr("outcomeID"))).css("color","var(--secText)");$(".card#whatIfResults .resultLetter").html("--");$(".card#whatIfResults .resultLetter").css("color","var(--secText)")}}),false)};var initWhatIf=function(course){if(!$(".card#whatIfResults").is(":visible")){course.gradeCalculation.dtech.whatIfOutcomes=JSON.parse(JSON.stringify(course.gradeCalculation.dtech.outcomes));$(".card#whatIfResults").show();$(".card#whatIfResults .resultLetter").html("--");$(".card#whatIfResults .resultLetter").css("color","var(--secText)")}};var calcWhatIf=function(course){if(course.gradeCalculation.dtech.whatIfOutcomes){var results=dtechGradeCalc.run(course.assignments,course.gradeCalculation.dtech.formula,course.gradeCalculation.dtech.whatIfOutcomes);course.gradeCalculation.dtech.whatIfOutcomes=results.outcomes;$(".card#whatIfResults .resultLetter").html(results.results.letter);if(results.results.percentage){$(".card#whatIfResults .resultPercentage").html("Percentage: "+Number(results.results.percentage).toFixed(2)+"%")}else{$(".card#whatIfResults .resultPercentage").html("")}$(".card#whatIfResults .resultLetter").css("color","var(--classColor)");$(".card.outcomeResults .dropped").removeClass("dropped");Object.keys(course.gradeCalculation.dtech.whatIfOutcomes).forEach(outcomeID=>{var outcome=course.gradeCalculation.dtech.whatIfOutcomes[outcomeID];if(outcome.average){$("#outcomeScore"+outcomeID).html(outcome.average.toFixed(2));$("#outcomeScore"+outcomeID).css("color",dtechRubricColor(outcome.average))}if(outcome.droppedScore!==undefined){$("#outcome"+outcomeID+"assessment"+outcome.droppedScore).addClass("dropped")}})}};var addWhatIf=function(course,outcomeID){initWhatIf(course);var aIndex=course.gradeCalculation.dtech.whatIfOutcomes[outcomeID].scores.length;course.gradeCalculation.dtech.whatIfOutcomes[outcomeID].scores.push({id:"whatIf"+aIndex,score:"--",value:4,whatIfGrade:true,outcome:outcomeID,color:"var(--secText)",assignmentTitle:"What-If Grade",description:"A What-If grade",title:course.gradeCalculation.dtech.whatIfOutcomes[outcomeID].title,assignmentID:null});$(".card.outcomeResults.outcome-"+outcomeID+" .assessments").append(`\n            <p id="outcome${outcomeID}assessment${aIndex}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">\n                <span aIndex="${aIndex}" outcomeID="${outcomeID}"\n                      style="outline: none;margin-right: 5px; font-size: 20px; vertical-align: middle; color: var(--secText);" class="editableScore" contenteditable>-</span>\n                <span class="assessmentTitle">What-If Grade</span>\n            </p>\n        `);$(".card#whatIfResults .resultLetter").html("--");$(".card#whatIfResults .resultLetter").css("color","var(--secText)");listenForWhatIf($(`#outcome${outcomeID}assessment${aIndex} .editableScore`)[0],course)}}));
//# sourceMappingURL=/scripts/lms/dtech.js.map