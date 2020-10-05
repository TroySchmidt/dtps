/**
 * @file d.tech-specific features, CBL & grade calculation
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * JSDoc documentation for these LMS functions can be found near the end of core.js
 */
var baseURL=document.currentScript.src.split("/scripts/lms/dtech.js")[0];jQuery.getScript(baseURL+"/scripts/lms/canvas.js",(function(){dtpsLMS.name="d.tech",dtpsLMS.legalName="Canvas LMS, Design Tech High School, and Instructure Inc",dtpsLMS.description="Power+ integration for Canvas LMS, customized for d.tech",dtpsLMS.logo="https://i.imgur.com/efGrLq3.png",dtpsLMS.source="https://github.com/jottocraft/dtps/blob/master/scripts/lms/dtech.js",dtpsLMS.useRubricGrades=!0,dtpsLMS.institutionSpecific=!0,dtpsLMS.genericGradebook=!1,dtpsLMS.updateAssignments=function(s){return new Promise((r,a)=>{r(s.map(s=>(s.rubric&&s.rubric.forEach(s=>{s.scoreName=e(s.scoreName),s.score&&(s.color=t(s.score))}),s)))})},dtpsLMS.updateClasses=function(e){return new Promise((t,s)=>{if(dtps.remoteConfig.showVideoMeetingButton){var r=[];e.forEach(e=>{e.homepage&&r.push(new Promise((t,s)=>{dtpsLMS.fetchHomepage(e.id).then(s=>{for(var r=0;r<$(s).find("a").length;r++){var a=$($(s).find("a")[r]);a.attr("alt")&&a.attr("alt").toUpperCase().includes("ZOOM BUTTON")&&a.attr("href")?e.videoMeetingURL=a.attr("href"):a.attr("href")&&a.attr("href").includes("zoom.us")}t()})}))}),Promise.all(r).then(()=>{t(e)})}else t(e)})},dtpsLMS.calculateGrade=function(e,t){if(dtps.remoteConfig.gradeCalculationEnabled){var r=null;if(("20-21"==e.term||"630"==e.id)&&(r="2020s1"),r){var a=s.run(t,r);return a?{letter:a.results.letter,dtech:a}:void 0}}};var e=function(e){return String(e).toUpperCase().includes("PIONEERING")?"Pioneering":String(e).toUpperCase().includes("PROFICIENT")?"Proficient":String(e).toUpperCase().includes("DEVELOPING")?"Developing":String(e).toUpperCase().includes("EMERGING")?"Emerging":!String(e).includes(" ")&&String(e).length<=20?e:""},t=function(e){return e>=4?"#4f9e59":e>=3?"#a1b553":e>=2?"#c26d44":e>=1?"#c4474e":e>=0?"#bd3139":void 0},s={letters:["A","A-","B+","B","B-","C","I"],params:{"2020s1":{percentage:{A:3.3,"A-":3.3,"B+":2.6,B:2.6,"B-":2.6,C:2.2,I:0},lowest:{A:3,"A-":2.5,"B+":2.2,B:1.8,"B-":1.5,C:1.5,I:0}}},average:function(e){var t=0;return e.forEach(e=>t+=e),t/e.length},run:function(e,t,s){var r=[],a=s||{};if("2020s1"==t){if(s||e.forEach(e=>{e.rubric&&e.rubric.forEach(e=>{e.score&&e.outcome&&(a[e.outcome]||(a[e.outcome]={scores:[]}),a[e.outcome].scores.push(e),e.title&&(a[e.outcome].title=e.title))})}),0==Object.keys(a).length)return;Object.values(a).forEach(e=>{var t=e.scores.map(e=>e.score),s=this.average(t),r=Math.min(...t),a=t.slice();a.splice(a.indexOf(r),1);var o=this.average(a);o>s?(e.scoreType="dropped",e.droppedScore=t.indexOf(r),e.average=o):(e.scoreType="all",e.average=s,delete e.droppedScore)});var o=Object.values(a).map(e=>e.average);r.push(this.getLetter(o,t,"all"))}var n=null;return r.forEach(e=>{(!n||this.letters.indexOf(e.letter)<this.letters.indexOf(n.letter))&&(n=e)}),{results:n,formula:t,outcomes:a}},getLetter:function(e,t,s){var r={};if(e.sort((e,t)=>t-e),"2020s1"==t){var a=[],o=Math.floor(.75*e.length);1==e.length?r.number75=e[0]:r.number75=e[o-1],r.number75thresh=o;for(var n=null,l=0;l<this.letters.length;l++){let e=this.letters[l];if(r.number75>=this.params[t].percentage[e]){n=e;break}}a.push(n);n=null;r.lowestScore=e[e.length-1];for(l=0;l<this.letters.length;l++){let e=this.letters[l];if(r.lowestScore>=this.params[t].lowest[e]){n=e;break}}a.push(n)}var c=a.map(e=>this.letters.indexOf(e)),i=Math.max(...c);return{letter:this.letters[i],parameters:r,variation:s}}};dtpsLMS.gradebook=function(e){return new Promise((r,a)=>{if(e.gradeCalculation&&e.gradeCalculation.dtech){if("2020s1"==e.gradeCalculation.dtech.formula)var o=`\n                    <div style="--classColor: ${e.color}" class="card">\n\n                        <h3 class="gradeTitle">\n                            Grades\n\n                            <div class="classGradeCircle">\n                                <div class="letter">${e.letter}</div>\n                            </div>\n\n                        </h3>\n\n                        <h5 class="gradeStat">\n                            75% (rounded down) of outcome scores are ≥\n                            <div class="numFont">${e.gradeCalculation.dtech.results.parameters.number75.toFixed(1)}</div>\n                        </h5>\n\n                        <h5 class="gradeStat">\n                            No outcome scores are lower than\n                            <div class="numFont">${e.gradeCalculation.dtech.results.parameters.lowestScore.toFixed(1)}</div>\n                        </h5>\n\n                        <div style="${dtps.gradebookExpanded?"":"display: none;"}" id="classGradeMore">\n                            <br />\n\n                            ${e.previousLetter?`\n                            <h5 class="smallStat">\n                                Previous Grade\n                                <div class="numFont">${e.previousLetter}</div>\n                            </h5>\n                            `:""}\n\n                            ${e.gradeCalculation.dtech.results.parameters.number75thresh?`\n                            <h5 class="smallStat">\n                                75% of outcomes (rounded down) is\n                                <div class="numFont">${e.gradeCalculation.dtech.results.parameters.number75thresh}</div>\n                            </h5>\n                            `:""}\n                        \n                            <br />\n\n                            <table class="u-full-width dtpsTable">\n                                <thead>\n                                    <tr>\n                                    <th>&nbsp;&nbsp;Final Letter</th>\n                                    <th>75% (rounded down) of outcome scores is ≥</th>\n                                    <th>No outcome scores below</th>\n                                    </tr>\n                                </thead>\n\n                                <tbody>\n                                    ${s.letters.map(t=>`\n                                            <tr ${e.letter==t?'style="background-color: var(--classColor); color: white; font-size:20px; font-weight: bold;"':""}>\n                                                <td>&nbsp;&nbsp;${t}</td>\n                                                <td>${s.params[e.gradeCalculation.dtech.formula].percentage[t]}</td>\n                                                <td>${s.params[e.gradeCalculation.dtech.formula].lowest[t]}</td>\n                                            </tr>\n                                        `).join("")}\n                                </tbody>\n                            </table>\n                        </div>\n\n                        <br />\n\n                        <br />\n                        <a onclick="$('#classGradeMore').toggle(); if ($('#classGradeMore').is(':visible')) {$(this).html('Show less'); dtps.gradebookExpanded = true;} else {$(this).html('Show more'); dtps.gradebookExpanded = false;}"\n                            style="color: var(--secText, gray); cursor: pointer; margin-right: 10px;">${dtps.gradebookExpanded?"Show less":"Show more"}</a>\n                        <a href="https://docs.google.com/document/d/1g4-aYZ_BS5_I4Ie64WGCwXeArl1K_pHbBbebDHra_sM/edit" style="color: var(--secText, gray);">Using 2020-21 grade calculation</a>\n                    </div>\n                `;else o="";var n=[],l=!1;Object.keys(e.gradeCalculation.dtech.outcomes).sort((function(t,s){var r=e.gradeCalculation.dtech.outcomes[t].average,a=e.gradeCalculation.dtech.outcomes[s].average;return null==r&&(r=999999-e.gradeCalculation.dtech.outcomes[t].scores.length),null==a&&(a=999999-e.gradeCalculation.dtech.outcomes[s].scores.length),r>a?1:r<a?-1:0})).forEach(s=>{var r=e.gradeCalculation.dtech.outcomes[s],a=!l&&!r.scores.length;a&&(l=!0),n.push(`\n                    ${a?'<h5 style="font-weight: bold;margin: 75px 75px 10px 75px;">Unassesed outcomes</h5>':""}\n\n                    <div style="border-radius: 20px;padding: 22px; padding-bottom: 20px;" class="card outcomeResults outcome-${s}">\n                        <h5 style="max-width: calc(100% - 50px); font-size: 24px; margin: 0px; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;">${r.title}</h5>\n\n                        ${void 0!==r.average?`\n                            <div id="outcomeScore${s}" style="position: absolute; top: 20px; right: 20px; font-size: 26px; font-weight: bold; display: inline-block; color: ${t(r.average)}">${r.average.toFixed(2)}</div>\n                        `:""}\n                        \n                        <div class="assessments">\n                            ${0==r.scores.length?'\n                                    <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px; color: var(--secText);">This outcome has not been assessed yet</p>\n                            ':r.scores.map((t,a)=>`\n                                        <p id="outcome${t.outcome}assessment${a}" class="${a==r.droppedScore?"dropped":""}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">\n                                            <span aIndex="${a}" outcomeID="${s}"\n                                                style="outline: none;margin-right: 5px; font-size: 20px; vertical-align: middle; color: ${t.color}" class="editableScore" ${dtps.remoteConfig.allowWhatIfGrades?"contenteditable":""}>${t.score}</span>\n                                            <span class="assessmentTitle" style="cursor: pointer;" onclick="dtps.assignment('${t.assignmentID}', ${e.num});">${t.assignmentTitle}</span>\n                                        </p>\n                                    `).join("")}\n                        </div>\n\n                        ${dtps.remoteConfig.allowWhatIfGrades?`\n                            <p class="addWhatIf" outcomeID="${s}" style="font-size: 14px; color: var(--secText); margin: 0px; margin-top: 16px; cursor: pointer;">\n                                <i style="cursor: pointer; vertical-align: middle; font-size: 16px;" class="material-icons down">add_box</i>\n                                Add a What-If grade\n                            </p>\n                        `:""}\n                    </div>\n                `)}),r(`\n                    <div style="--classColor: ${e.color}" class="card" id="whatIfResults">\n                        <div style="display: inline-block;">\n                           <h5>\n                              What-If Grade\n                              <div class="resultLetter">--</div>\n                           </h5>\n                           <p style="color: var(--lightText);" class="resultPercentage"></p>\n                           <p>This grade is hypothetical and does not represent your actual grade for this class.</p>\n                           <p onclick="fluid.screen();" style="color: var(--secText); cursor: pointer;">Show actual grades</p>\n                        </div>\n                    </div>\n                `+o+"<br />"+n.join(""))}else r()})},dtpsLMS.gradebookDidRender=function(e){$(".card.outcomeResults .assessments .editableScore").toArray().forEach(t=>{r(t,e)}),$("p.addWhatIf").click((function(){n(e,$(this).attr("outcomeID"))}))};var r=function(e,s){e.addEventListener("input",(function(){a(s);var r=Number($(e).text());$(e).text()&&$(e).text().length<4&&!isNaN(r)&&r>=1&&r<=4?($(e).css("color",t(r)),s.gradeCalculation.dtech.whatIfOutcomes[Number($(e).attr("outcomeID"))].scores[Number($(e).attr("aIndex"))].score=r,o(s)):($(e).css("color","var(--secText)"),$("#outcomeScore"+Number($(e).attr("outcomeID"))).html("--"),$("#outcomeScore"+Number($(e).attr("outcomeID"))).css("color","var(--secText)"),$(".card#whatIfResults .resultLetter").html("--"),$(".card#whatIfResults .resultLetter").css("color","var(--secText)"))}),!1)},a=function(e){$(".card#whatIfResults").is(":visible")||(e.gradeCalculation.dtech.whatIfOutcomes=JSON.parse(JSON.stringify(e.gradeCalculation.dtech.outcomes)),$(".card#whatIfResults").show(),$(".card#whatIfResults .resultLetter").html("--"),$(".card#whatIfResults .resultLetter").css("color","var(--secText)"))},o=function(e){if(e.gradeCalculation.dtech.whatIfOutcomes){var r=s.run(e.assignments,e.gradeCalculation.dtech.formula,e.gradeCalculation.dtech.whatIfOutcomes);e.gradeCalculation.dtech.whatIfOutcomes=r.outcomes,$(".card#whatIfResults .resultLetter").html(r.results.letter),r.results.percentage?$(".card#whatIfResults .resultPercentage").html("Percentage: "+Number(r.results.percentage).toFixed(2)+"%"):$(".card#whatIfResults .resultPercentage").html(""),$(".card#whatIfResults .resultLetter").css("color","var(--classColor)"),$(".card.outcomeResults .dropped").removeClass("dropped"),Object.keys(e.gradeCalculation.dtech.whatIfOutcomes).forEach(s=>{var r=e.gradeCalculation.dtech.whatIfOutcomes[s];r.average&&($("#outcomeScore"+s).html(r.average.toFixed(2)),$("#outcomeScore"+s).css("color",t(r.average))),void 0!==r.droppedScore&&$("#outcome"+s+"assessment"+r.droppedScore).addClass("dropped")})}},n=function(e,t){a(e);var s=e.gradeCalculation.dtech.whatIfOutcomes[t].scores.length;e.gradeCalculation.dtech.whatIfOutcomes[t].scores.push({id:"whatIf"+s,score:"--",value:4,whatIfGrade:!0,outcome:t,color:"var(--secText)",assignmentTitle:"What-If Grade",description:"A What-If grade",title:e.gradeCalculation.dtech.whatIfOutcomes[t].title,assignmentID:null}),$(".card.outcomeResults.outcome-"+t+" .assessments").append(`\n            <p id="outcome${t}assessment${s}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 6px 0px;">\n                <span aIndex="${s}" outcomeID="${t}"\n                      style="outline: none;margin-right: 5px; font-size: 20px; vertical-align: middle; color: var(--secText);" class="editableScore" contenteditable>-</span>\n                <span class="assessmentTitle">What-If Grade</span>\n            </p>\n        `),$(".card#whatIfResults .resultLetter").html("--"),$(".card#whatIfResults .resultLetter").css("color","var(--secText)"),r($(`#outcome${t}assessment${s} .editableScore`)[0],e)}}));
//# sourceMappingURL=/scripts/lms/dtech.js.map