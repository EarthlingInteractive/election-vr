!function(t){function e(e){for(var r,s,a=e[0],l=e[1],h=e[2],d=0,u=[];d<a.length;d++)s=a[d],n[s]&&u.push(n[s][0]),n[s]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(t[r]=l[r]);for(c&&c(e);u.length;)u.shift()();return o.push.apply(o,h||[]),i()}function i(){for(var t,e=0;e<o.length;e++){for(var i=o[e],r=!0,a=1;a<i.length;a++){var l=i[a];0!==n[l]&&(r=!1)}r&&(o.splice(e--,1),t=s(s.s=i[0]))}return t}var r={},n={0:0};var o=[];function s(e){if(r[e])return r[e].exports;var i=r[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=t,s.c=r,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},s.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="";var a=window.webpackJsonp=window.webpackJsonp||[],l=a.push.bind(a);a.push=e,a=a.slice();for(var h=0;h<a.length;h++)e(a[h]);var c=l;o.push([31,1]),i()}([,,,,,,,function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=window.AFRAME.THREE;e.DARK_GRAY=new r.Color(5658202),e.REPUBLICAN_RED=new r.Color(15277326),e.DEMOCRAT_BLUE=new r.Color(2302054),e.LIBERTARIAN_GOLD=new r.Color(15058433),e.GREEN_PARTY_GREEN=new r.Color(43356),e.INDEPENDENT_PURPLE=new r.Color(9699539),e.YEARS=["2016","2012","2008","2004"]},,,,,,,,,function(t,e,i){"use strict";var r=function(){return function(t,e){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return function(t,e){var i=[],r=!0,n=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(r=(s=a.next()).done)&&(i.push(s.value),!e||i.length!==e);r=!0);}catch(t){n=!0,o=t}finally{try{!r&&a.return&&a.return()}finally{if(n)throw o}}return i}(t,e);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();i(2);var n=window.AFRAME;function o(t,e,i){var r=n.utils.styleParser.stringify,o=n.utils.extend,s=t.getAttribute(e);s&&t.setAttribute(e,r(o(s,i)))}n.registerComponent("progressive-controls",{schema:{maxLevel:{default:"touch",oneOf:["gaze","point","touch"]},gazeMixin:{default:""},pointMixin:{default:""},touchMixin:{default:""},override:{default:!1},objects:{default:""},controllerModel:{default:!0}},init:function(){var t=this;this.levels=["gaze","point","touch"],this.currentLevel=new Map,this.controllerName=new Map;var e=this.el.sceneEl.querySelector("a-assets")||this.el.sceneEl.appendChild(document.createElement("a-assets")),i=this.gazeDefault=document.createElement("a-mixin"),r=n.utils.styleParser.stringify({colliderEvent:"raycaster-intersection",colliderEventProperty:"els",colliderEndEvent:"raycaster-intersection-cleared",colliderEndEventProperty:"clearedEls",colliderState:""});i.setAttribute("id","progressivecontrolsgazedefault"),i.setAttribute("geometry","primitive: ring;radiusOuter: 0.008; radiusInner: 0.005; segmentsTheta: 32"),i.setAttribute("material","color: #000; shader: flat"),i.setAttribute("position","0 0 -0.5"),i.setAttribute("raycaster",""),i.setAttribute("super-hands",r);var o=this.pointDefault=document.createElement("a-mixin");o.setAttribute("id","progressivecontrolspointdefault"),o.setAttribute("raycaster","showLine: true"),o.setAttribute("super-hands",r);var s=this.touchDefault=document.createElement("a-mixin");if(s.setAttribute("id","progressivecontrolstouchdefault"),s.setAttribute("super-hands",""),s.setAttribute("sphere-collider",""),this.el.sceneEl.getAttribute("physics")){o.setAttribute("static-body","shape: sphere; sphereRadius: 0.02"),i.setAttribute("static-body","shape: sphere; sphereRadius: 0.02"),s.setAttribute("static-body","shape: sphere; sphereRadius: 0.02")}e.appendChild(i),e.appendChild(o),e.appendChild(s),this.camera=this.el.querySelector("a-camera,[camera]"),this.camera||(this.camera=this.el.appendChild(document.createElement("a-camera")),parseFloat(n.version)>.7&&this.camera.setAttribute("position","0 1.6 0")),this.caster=this.camera.querySelector(".gazecaster")||this.camera.appendChild(document.createElement("a-entity")),["left","right"].forEach(function(e){t[e]=t.el.querySelector("."+e+"-controller")||t.el.appendChild(document.createElement("a-entity"));var i={hand:e,model:t.data.controllerModel};["daydream-controls","gearvr-controls","oculus-touch-controls","vive-controls","windows-motion-controls","oculus-go-controls"].forEach(function(r){return t[e].setAttribute(r,i)})}),this.el.addEventListener("controllerconnected",function(e){return t.detectLevel(e)}),this.eventRepeaterB=this.eventRepeater.bind(this),this.addEventListeners(),this.currentLevel.set("right",0)},update:function(t){var e={objects:this.data.objects};o(this.gazeDefault,"raycaster",e),o(this.pointDefault,"raycaster",e),o(this.touchDefault,"sphere-collider",e);var i=!0,n=!1,s=void 0;try{for(var a,l=this.currentLevel[Symbol.iterator]();!(i=(a=l.next()).done);i=!0){var h=a.value,c=r(h,2),d=c[0],u=c[1];this.setLevel(u,d,!0)}}catch(t){n=!0,s=t}finally{try{!i&&l.return&&l.return()}finally{if(n)throw s}}},remove:function(){if(this.eventsRegistered){var t=this.el.sceneEl.canvas;t.removeEventListener("mousedown",this.eventRepeaterB),t.removeEventListener("mouseup",this.eventRepeaterB),t.removeEventListener("touchstart",this.eventRepeaterB),t.removeEventListener("touchend",this.eventRepeaterB)}},setLevel:function(t,e,i){e=e||"right";var r=this.levels.indexOf(this.data.maxLevel),n=this[e],o=this.data.override;if((t=t>r?r:t)!==this.currentLevel.get(e)||i){switch(0!==t&&this.caster&&(this.caster.setAttribute("mixin",""),this.camera.removeChild(this.caster),this.caster=null),t){case this.levels.indexOf("gaze"):var s=this.data.gazeMixin;this.caster.setAttribute("mixin",(o&&s.length?"":"progressivecontrolsgazedefault ")+s);break;case this.levels.indexOf("point"):var a=this.controllerName.get(e),l=this.controllerConfig[a],h=this.data.pointMixin;l&&l.raycaster&&n.setAttribute("raycaster",l.raycaster),n.setAttribute("mixin",(o&&h.length?"":"progressivecontrolspointdefault ")+h);break;case this.levels.indexOf("touch"):var c=this.data.touchMixin;n.setAttribute("mixin",(o&&c.length?"":"progressivecontrolstouchdefault ")+c)}this.currentLevel.set(e,t),this.el.emit("controller-progressed",{level:this.levels[t],hand:e})}},detectLevel:function(t){var e=t.detail.component.data.hand||"right";this.controllerName.set(e,t.detail.name),-1!==["vive-controls","oculus-touch-controls","windows-motion-controls"].indexOf(t.detail.name)?this.setLevel(this.levels.indexOf("touch"),e):-1!==["gearvr-controls","daydream-controls","oculus-go-controls"].indexOf(t.detail.name)&&this.setLevel(this.levels.indexOf("point"),e)},eventRepeater:function(t){this.caster&&(t.type.startsWith("touch")&&(t.preventDefault(),"touchmove"===t.type)||this.caster.emit(t.type,t.detail))},addEventListeners:function(){this.el.sceneEl.canvas?(this.el.sceneEl.canvas.addEventListener("mousedown",this.eventRepeaterB),this.el.sceneEl.canvas.addEventListener("mouseup",this.eventRepeaterB),this.el.sceneEl.canvas.addEventListener("touchstart",this.eventRepeaterB),this.el.sceneEl.canvas.addEventListener("touchmove",this.eventRepeaterB),this.el.sceneEl.canvas.addEventListener("touchend",this.eventRepeaterB),this.eventsRegistered=!0):this.el.sceneEl.addEventListener("loaded",this.addEventListeners.bind(this))},controllerConfig:{"gearvr-controls":{raycaster:{origin:{x:0,y:5e-4,z:0}}},"oculus-touch-controls":{raycaster:{origin:{x:.001,y:0,z:.065},direction:{x:0,y:-.8,z:-1}}},"oculus-go-controls":{raycaster:{origin:{x:0,y:5e-4,z:0}}},"windows-motion-controls":{raycaster:{direction:{x:0,y:-.4472,z:-.8944}}}}})},function(t,e,i){"use strict";i(2);var r=window.AFRAME;r.registerComponent("button",{schema:{value:{type:"string"},textColor:{type:"color",default:"#000000"},textWrapCount:{default:4},buttonColor:{type:"color",default:"#FFFFFF"},borderColor:{type:"color",default:"#000000"},selectionColor:{type:"color",default:"#E5C601"},buttonHeight:{default:.25},buttonWidth:{default:.5}},init:function(){this.handleHoverStart=this.handleHoverStart.bind(this),this.handleHoverEnd=this.handleHoverEnd.bind(this),this.handleStateChange=this.handleStateChange.bind(this),this.renderLayout()},update:function(t){r.utils.deepEqual(t,this.data)||this.renderLayout()},remove:function(){this.buttonBorder.removeEventListener("hover-start",this.handleHoverStart),this.buttonBorder.removeEventListener("hover-end",this.handleHoverEnd),this.button.removeEventListener("stateadded",this.handleStateChange)},handleStateChange:function(t){var e=this;"clicked"===t.detail&&(this.button.setAttribute("material","color",this.data.selectionColor),this.el.emit("clicked"),window.setTimeout(function(){e.button.setAttribute("material","color",e.data.buttonColor)},100))},handleHoverStart:function(t){this.buttonBorder.setAttribute("material","color",this.data.selectionColor),t.detail.hand.components.haptics&&t.detail.hand.components.haptics.pulse(.2,10)},handleHoverEnd:function(){this.buttonBorder.setAttribute("material","color",this.data.borderColor)},renderLayout:function(){this.button||(this.button=document.createElement("a-entity"),this.button.setAttribute("class","selectable button"),this.button.setAttribute("clickable",{}),this.button.setAttribute("onclick",'this.emit("grab-start", {}); this.emit("grab-end", {});'),this.button.addEventListener("stateadded",this.handleStateChange),this.button.setAttribute("material","shader","flat"),this.button.setAttribute("text","align","center"),this.el.appendChild(this.button)),this.button.setAttribute("geometry",{primitive:"plane",height:this.data.buttonHeight,width:this.data.buttonWidth}),this.button.setAttribute("material","color",this.data.buttonColor),this.button.setAttribute("text","value",this.data.value),this.button.setAttribute("text","color",this.data.textColor),this.button.setAttribute("text","wrapCount",this.data.textWrapCount),this.button.setAttribute("text","zOffset",.005),this.buttonBorder||(this.buttonBorder=document.createElement("a-plane"),this.buttonBorder.setAttribute("class","border"),this.buttonBorder.setAttribute("hoverable",{}),this.buttonBorder.setAttribute("position","0 0 -0.005"),this.buttonBorder.setAttribute("material","shader","flat"),this.buttonBorder.addEventListener("hover-start",this.handleHoverStart),this.buttonBorder.addEventListener("hover-end",this.handleHoverEnd),this.button.appendChild(this.buttonBorder));this.buttonBorder.setAttribute("height",1.16*this.data.buttonHeight),this.buttonBorder.setAttribute("width",1.08*this.data.buttonWidth),this.buttonBorder.setAttribute("material","color",this.data.borderColor)}})},function(t,e,i){"use strict";i(2),window.AFRAME.registerPrimitive("a-text-panel",{defaultComponents:{geometry:{primitive:"plane",width:.5,height:"auto"},material:{shader:"flat",color:"black",opacity:1},text:{color:"white",align:"center",wrapCount:32,zOffset:.005}},mappings:{primitive:"geometry.primitive",width:"geometry.width",height:"geometry.height",textcolor:"text.color",textalign:"text.align",textwrapcount:"text.wrapCount",textvalue:"text.value",panelcolor:"material.color",opacity:"material.opacity",textopacity:"text.opacity"}})},function(t,e,i){"use strict";var r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r])}return t};i(2),window.AFRAME.registerComponent("tutorial-step",{schema:{dur:{type:"number"},controllerTypes:{type:"array"},triggerEvent:{type:"string"},anchor:{type:"selector",default:"[tutorial]"},offset:{type:"vec3",default:{x:0,y:0,z:0}},textvalue:{type:"string"}},init:function(){this.handleTriggerEvent=this.handleTriggerEvent.bind(this),this.stepEl=document.createElement("a-text-panel"),this.stepEl.object3D.visible=!1,this.stepEl.setAttribute("opacity",0),this.stepEl.setAttribute("textopacity",0),this.stepEl.setAttribute("height",2),this.stepEl.setAttribute("width",4);var t={dur:400,easing:"linear",from:0,to:1,startEvents:"show-step"};this.stepEl.setAttribute("animation__fadein_panel",r({property:"opacity"},t)),this.stepEl.setAttribute("animation__fadein_text",r({property:"textopacity"},t))},handleTriggerEvent:function(){this.el.emit("next-step")},update:function(t){this.timeoutId&&window.clearTimeout(this.timeoutId),this.stepEl.setAttribute("textvalue",this.data.textvalue),this.stepEl.setAttribute("position",this.data.offset),this.data.anchor!==t.anchor&&(t.anchor&&t.anchor.removeChild(this.stepEl),this.data.anchor.appendChild(this.stepEl))},remove:function(){this.data.anchor.removeChild(this.stepEl),this.stepEl.removeEventListener("animationcomplete",this.handleAnimationComplete)},show:function(){var t=this;this.stepEl.object3D.visible=!0,this.stepEl.setAttribute("opacity",0),this.stepEl.setAttribute("textopacity",0),this.data.triggerEvent&&this.el.sceneEl.addEventListener(this.data.triggerEvent,this.handleTriggerEvent),this.stepEl.emit("show-step"),this.data.dur&&!this.timeoutId&&(this.timeoutId=window.setTimeout(function(){t.timeoutId=null,t.el.emit("next-step")},this.data.dur))},hide:function(){this.timeoutId&&(window.clearTimeout(this.timeoutId),this.timeoutId=null),this.data.triggerEvent&&this.el.sceneEl.removeEventListener(this.data.triggerEvent,this.handleTriggerEvent),this.stepEl.object3D.visible=!1}})},function(t,e,i){"use strict";i(2);var r=window.AFRAME;r.registerComponent("tutorial",{schema:{currentStep:{type:"number",default:-1}},init:function(){this.superHands=document.querySelector("[progressive-controls]"),this.handleControllerChange=this.handleControllerChange.bind(this),this.superHands.addEventListener("controller-progressed",this.handleControllerChange),this.tutorialSteps=this.el.querySelectorAll("[tutorial-step]"),this.handleNextStep=this.handleNextStep.bind(this),this.el.addEventListener("next-step",this.handleNextStep),this.nextStepButton=document.querySelector("#next-tutorial-step"),this.nextStepButton.addEventListener("clicked",this.handleNextStep),this.handleStartTutorial=this.handleStartTutorial.bind(this),this.startTutorialButton=document.querySelector("#start-tutorial"),this.startTutorialButton.addEventListener("clicked",this.handleStartTutorial),this.handleStopTutorial=this.handleStopTutorial.bind(this),this.stopTutorialButton=document.querySelector("#stop-tutorial"),this.stopTutorialButton.addEventListener("clicked",this.handleStopTutorial),this.handleControllerChange()},remove:function(){this.el.sceneEl.removeEventListener("target-selected",this.handleNextStep),this.el.removeEventListener("next-step",this.handleNextStep),this.nextStepButton.removeEventListener("clicked",this.handleNextStep),this.startTutorialButton.removeEventListener("clicked",this.handleStartTutorial),this.stopTutorialButton.removeEventListener("clicked",this.handleStopTutorial)},update:function(t){this.data.currentStep!==t.currentStep&&this.transition(t.currentStep,this.data.currentStep)},transition:function(t,e){this.hasStep(t)&&this.getStep(t).hide(),this.hasStep(e)&&this.getStep(e).show(),this.tutorialSteps[e]||this.handleStopTutorial()},getStep:function(t){return this.tutorialSteps[t].components["tutorial-step"]},hasStep:function(t){return void 0!==t&&t>=0&&this.tutorialSteps[t]},handleStartTutorial:function(){this.startTutorialButton.setAttribute("visible",!1),this.startTutorialButton.setAttribute("position","-5 -0.5 -1"),this.nextStepButton.setAttribute("visible",!0),this.stopTutorialButton.setAttribute("visible",!0),this.el.setAttribute("tutorial","currentStep",0)},handleStopTutorial:function(){this.startTutorialButton.setAttribute("visible",!0),this.startTutorialButton.setAttribute("position","0 -1.25 0.01"),this.nextStepButton.setAttribute("visible",!1),this.stopTutorialButton.setAttribute("visible",!1),this.el.setAttribute("tutorial","currentStep",-1)},handleControllerChange:function(){var t=this.superHands.components["progressive-controls"],e=t.currentLevel.get("right"),i="";i="gaze"===t.levels[e]?r.utils.device.checkHeadsetConnected()?"gaze":"desktop":1===t.currentLevel.size?"singlePointer":"doublePointer",this.determineRelevantSteps(i)},determineRelevantSteps:function(t){var e=this.el.querySelectorAll("[tutorial-step]");this.tutorialSteps=[];for(var i=0;i<e.length;i+=1){var r=e[i],n=r.getAttribute("tutorial-step").controllerTypes;(0===n.length||n.includes(t))&&this.tutorialSteps.push(r)}},handleNextStep:function(){var t=this.data.currentStep+1;t>this.tutorialSteps.length&&(t=-1),this.el.setAttribute("tutorial","currentStep",t)}})},function(t,e,i){"use strict";i(2);var r=window.AFRAME;r.registerComponent("help",{init:function(){this.superHands=document.querySelector("[progressive-controls]"),this.handleControllerChange=this.handleControllerChange.bind(this),this.superHands.addEventListener("controller-progressed",this.handleControllerChange),this.hideHelp=this.hideHelp.bind(this),this.el.sceneEl.addEventListener("year-changed",this.hideHelp),this.el.sceneEl.addEventListener("target-selected",this.hideHelp),this.helpEls={}},remove:function(){this.superHands.removeEventListener("controller-progressed",this.handleControllerChange),this.el.sceneEl.removeEventListener("year-changed",this.hideHelp),this.el.sceneEl.removeEventListener("target-selected",this.hideHelp),this.clearHelpEls()},handleControllerChange:function(t){"gaze"===t.detail.level?this.setupGazeHelp(t.target):"right"===t.detail.hand?this.setupRightPointerHelp(t.target):this.setupLeftPointerHelp(t.target),this.showHelp()},createTextPanel:function(t){var e=document.createElement("a-entity");return e.setAttribute("geometry",{primitive:"plane",height:"auto"}),e.setAttribute("material","shader","flat"),e.setAttribute("material","color","white"),e.setAttribute("material","opacity","0.75"),e.setAttribute("text","color","black"),e.setAttribute("text","value",t),e},setupGazeHelp:function(t){this.clearPointerHelpEls();var e="Gaze at something for 1 second to select it.";r.utils.device.isMobile()||(e+="\nUse the w-a-s-d keys to move around.");var i=this.createTextPanel(e);i.setAttribute("text","wrapCount","15"),i.setAttribute("geometry","width","0.5"),i.setAttribute("text","align","center"),i.setAttribute("position","0.3 0 -2"),t.components["progressive-controls"].caster.parentEl.appendChild(i),this.helpEls.gazeHelp=i},setupRightPointerHelp:function(t){this.clearGazeHelpEl();var e=this.createTextPanel("To select something, point the laser at it and pull the trigger button.\n\n        To move the map, point the laser at it, hold down the grip buttons, and move the controller.");e.setAttribute("geometry","width","0.18"),e.setAttribute("text","wrapCount","20"),e.setAttribute("text","align","left"),e.setAttribute("position","0.15 0 0.05"),e.setAttribute("rotation","-90 0 0"),t.components["progressive-controls"].right.appendChild(e),this.helpEls.rightPointerHelpEl=e},setupLeftPointerHelp:function(t){this.clearGazeHelpEl();var e=this.createTextPanel("To resize the map, point both the lasers at the map, hold down both triggers, and move the controllers apart or together.\n\n        To resize and move the map at the same time, point both the lasers at the map, hold down the grip buttons on both controllers, and move the controllers around.");e.setAttribute("geometry","width","0.18"),e.setAttribute("text","wrapCount","20"),e.setAttribute("text","align","left"),e.setAttribute("position","-0.15 0 0.05"),e.setAttribute("rotation","-90 0 0"),t.components["progressive-controls"].left.appendChild(e),this.helpEls.leftPointerHelpEl=e},showHelp:function(){var t=this;Object.keys(this.helpEls).forEach(function(e){t.helpEls[e].setAttribute("visible",!0)})},hideHelp:function(){var t=this;Object.keys(this.helpEls).forEach(function(e){t.helpEls[e].setAttribute("visible",!1)})},clearGazeHelpEl:function(){this.helpEls.gazeHelp&&(this.helpEls.gazeHelp.parentEl.removeChild(this.helpEls.gazeHelp),delete this.helpEls.gazeHelp)},clearPointerHelpEls:function(){this.helpEls.rightPointerHelpEl&&(this.helpEls.rightPointerHelpEl.parentEl.removeChild(this.helpEls.rightPointerHelpEl),delete this.helpEls.rightPointerHelpEl),this.helpEls.leftPointerHelpEl&&(this.helpEls.leftPointerHelpEl.parentEl.removeChild(this.helpEls.leftPointerHelpEl),delete this.helpEls.leftPointerHelpEl)},clearHelpEls:function(){this.clearGazeHelpEl(),this.clearPointerHelpEls()}})},function(t,e,i){"use strict";i(2);var r=i(7),n=window.AFRAME;window.dataLayer=window.dataLayer||[],n.registerComponent("year-selector",{schema:{selectedYear:{type:"string"},selectionColor:{type:"color",default:"#E5C601"}},init:function(){this.handleHoverStart=this.handleHoverStart.bind(this),this.handleHoverEnd=this.handleHoverEnd.bind(this),this.handleStateChange=this.handleStateChange.bind(this),this.createButtons()},update:function(t){var e=this;this.data.selectedYear===t.selectedYear&&this.data.selectionColor===t.selectionColor||r.YEARS.forEach(function(t){var i=e.buttons[t];t===e.data.selectedYear?i.setAttribute("material","color",e.data.selectionColor):i.setAttribute("material","color","#FFFFFF")}),this.data.selectedYear!==t.selectedYear&&(this.el.emit("year-changed",{year:this.data.selectedYear},!0),window.dataLayer.push({event:"year-changed",year:this.data.selectedYear}))},remove:function(){var t=this;r.YEARS.forEach(function(e){var i=t.buttons[e].querySelector(".border");i.removeEventListener("hover-start",t.handleHoverStart),i.removeEventListener("hover-end",t.handleHoverEnd)})},handleStateChange:function(t){var e=this;"clicked"===t.detail&&r.YEARS.forEach(function(i){var r=e.buttons[i];r===t.target?(r.setAttribute("material","color",e.data.selectionColor),e.el.setAttribute("year-selector","selectedYear",i)):r.setAttribute("material","color","#FFFFFF")})},handleHoverStart:function(t){t.target.setAttribute("material","color",this.data.selectionColor),t.detail.hand.components.haptics&&t.detail.hand.components.haptics.pulse(.2,10)},handleHoverEnd:function(t){t.target.setAttribute("material","color","black")},createButtons:function(){var t=this,e=0;this.buttons={},r.YEARS.forEach(function(i){var r=document.createElement("a-entity");r.setAttribute("geometry",{primitive:"plane",height:.25,width:.5}),r.setAttribute("class","selectable"),r.setAttribute("clickable",{}),r.setAttribute("onclick",'this.emit("grab-start", {}); this.emit("grab-end", {});'),r.addEventListener("stateadded",t.handleStateChange),r.setAttribute("position",e+" 0 0"),r.setAttribute("material","shader","flat"),r.setAttribute("material","color","#FFFFFF"),r.setAttribute("text","value",i),r.setAttribute("text","color","black"),r.setAttribute("text","wrapCount","4"),r.setAttribute("text","align","center"),r.setAttribute("text","zOffset","0.05");var n=document.createElement("a-plane");n.setAttribute("class","border"),n.setAttribute("hoverable",{}),n.setAttribute("position","0 0 -0.005"),n.setAttribute("material","shader","flat"),n.setAttribute("material","color","black"),n.setAttribute("height",.29),n.setAttribute("width",.54),n.addEventListener("hover-start",t.handleHoverStart),n.addEventListener("hover-end",t.handleHoverEnd),r.appendChild(n),t.buttons[i]=r,t.el.appendChild(r),e+=.55})}})},function(t,e,i){"use strict";i(2);var r=i(3);window.AFRAME.registerComponent("selection-info",{schema:{state:{type:"string"},candidate:{type:"string"},party:{type:"string"},votes:{type:"number"},electoralVotes:{type:"number"},totalVotes:{type:"number"},percentage:{type:"number"},color:{type:"color"}},init:function(){this.voteFormatter=(0,r.format)(","),this.totalVoteFormatter=(0,r.format)(".3s"),this.percentageFormatter=(0,r.format)(".3p")},getInfoText:function(){return this.data.state+"\n            "+this.data.candidate+" ("+this.data.party+")\n            "+this.data.electoralVotes+" electoral votes\n            "+this.voteFormatter(this.data.votes)+" votes\n            "+this.percentageFormatter(this.data.percentage)+" of "+this.totalVoteFormatter(this.data.totalVotes)+" total"}})},function(t,e,i){"use strict";i(2);var r=window.AFRAME,n=r.THREE;window.dataLayer=window.dataLayer||[],r.registerComponent("selection-handler",{init:function(){this.selectionBox=new n.Box3Helper(new n.Box3,"black"),this.selectedObjWorldCenter=new n.Vector3,this.selectionBox.visible=!1,this.el.setObject3D("selectionBox",this.selectionBox),this.stateBox=new n.Box3,this.infoPanelAnchorPosition=new n.Vector3,this.infoPanel=document.querySelector("#info-panel"),this.infoPanelText=document.querySelector("#info-panel-text"),this.infoPanelHighlight=document.querySelector("#info-panel-highlight"),this.superHands=document.querySelector("[progressive-controls]"),this.handleControllerChange=this.handleControllerChange.bind(this),this.superHands.addEventListener("controller-progressed",this.handleControllerChange),this.handleSelection=this.handleSelection.bind(this),this.turnSelectionOff=this.turnSelectionOff.bind(this),this.el.sceneEl.addEventListener("year-changed",this.turnSelectionOff),this.handleControllerChange()},handleControllerChange:function(){var t=this.superHands.components["progressive-controls"],e=t.currentLevel.get("right");"gaze"===t.levels[e]?(this.el.removeEventListener("grab-end",this.handleSelection),this.el.addEventListener("click",this.handleSelection)):(this.el.removeEventListener("click",this.handleSelection),this.el.addEventListener("grab-end",this.handleSelection))},remove:function(){this.el.removeEventListener("click",this.handleSelection),this.el.removeEventListener("grab-end",this.handleSelection),this.superHands.removeEventListener("controller-progressed",this.handleControllerChange),this.el.sceneEl.removeEventListener("year-changed",this.turnSelectionOff)},handleSelection:function(t){var e=t.target;this.el.emit("target-selected",{targetEl:e},!0),this.isAlreadySelected(e)?this.turnSelectionOff():this.isSelectable(e)&&this.setSelectionTo(e)},isAlreadySelected:function(t){return t===this.selected},isSelectable:function(t){return!!t.components["selection-info"]},setSelectionTo:function(t){this.selected&&this.turnSelectionOff(),this.selected=t;var e=this.selected.getObject3D("mesh");e.geometry.computeBoundingBox(),this.showSelectionBoxFor(e),this.selected.setAttribute("scale","1.05 1.05 1.01"),this.selected.setAttribute("material","visible",!0),this.selected.addState("selected"),this.showInfoPanel(e)},showSelectionBoxFor:function(t){t.getWorldPosition(this.selectedObjWorldCenter);var e=this.el.object3D.worldToLocal(this.selectedObjWorldCenter),i=new n.Box3;i.setFromCenterAndSize(e,t.geometry.boundingBox.getSize(new n.Vector3)),this.selectionBox.box=i,this.selectionBox.visible=!0},showInfoPanel:function(){var t=this.selected.components["selection-info"];this.infoPanelText.setAttribute("value",t.getInfoText()),this.calculateInfoPanelAnchorPosition(),this.infoPanel.object3D.position.copy(this.infoPanelAnchorPosition),this.infoPanelHighlight.setAttribute("color","#"+t.data.color),this.infoPanel.object3D.visible=!0;var e=t.data,i=e.state,r=e.candidate;window.dataLayer.push({event:"data-selected",state:i,candidate:r})},calculateInfoPanelAnchorPosition:function(){this.stateBox.setFromObject(this.selected.parentEl.object3D),this.stateBox.getCenter(this.infoPanelAnchorPosition),this.infoPanelAnchorPosition.setY(this.stateBox.max.y+.75)},needsPositionUpdate:function(){return!this.infoPanel.object3D.position.equals(this.infoPanelAnchorPosition)},tick:function(){this.selected&&(this.calculateInfoPanelAnchorPosition(),this.needsPositionUpdate()&&this.infoPanel.object3D.position.copy(this.infoPanelAnchorPosition))},turnSelectionOff:function(){this.infoPanel.object3D.visible=!1,this.selectionBox.visible=!1,this.selected&&(this.selected.setAttribute("scale","1 1 1"),this.selected.setAttribute("material","visible",!1),this.selected.removeState("selected"),this.selected=null)}})},function(t,e,i){"use strict";i(2),window.AFRAME.registerComponent("hover-handler",{init:function(){this.handleHoverStart=this.handleHoverStart.bind(this),this.el.addEventListener("hover-start",this.handleHoverStart),this.handleHoverEnd=this.handleHoverEnd.bind(this),this.el.addEventListener("hover-end",this.handleHoverEnd),this.el.sceneEl.addEventListener("year-changed",this.handleHoverEnd)},remove:function(){this.el.removeEventListener("hover-start",this.handleHoverStart),this.el.removeEventListener("hover-end",this.handleHoverEnd),this.el.sceneEl.removeEventListener("year-changed",this.handleHoverEnd)},handleHoverStart:function(t){this.selected=t.target,this.selected.components.hoverable&&(this.selected.setAttribute("scale","1.05 1.05 1.01"),this.selected.setAttribute("material","visible",!0),t.detail.hand.components.haptics&&t.detail.hand.components.haptics.pulse(.2,10))},handleHoverEnd:function(){this.selected&&!this.selected.is("selected")&&(this.selected.setAttribute("scale","1 1 1"),this.selected.setAttribute("material","visible",!1))}})},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e.default=t,e}(i(7));var n={"Trump, Donald J.":{firstName:"Donald J.",lastName:"Trump",party:"R",color:r.REPUBLICAN_RED},"Clinton, Hillary":{firstName:"Hillary",lastName:"Clinton",party:"D",color:r.DEMOCRAT_BLUE},"Johnson, Gary":{firstName:"Gary",lastName:"Johnson",party:"LIB",color:r.LIBERTARIAN_GOLD},"Stein, Jill":{firstName:"Jill",lastName:"Stein",party:"GRE",color:r.GREEN_PARTY_GREEN},"McMullin, Evan":{firstName:"Evan",lastName:"McMullin",party:"IND",color:r.INDEPENDENT_PURPLE},"Obama, Barack":{firstName:"Barak",lastName:"Obama",party:"D",color:r.DEMOCRAT_BLUE},"Romney, Mitt":{firstName:"Mitt",lastName:"Romney",party:"R",color:r.REPUBLICAN_RED},"McCain, John":{firstName:"John",lastName:"McCain",party:"R",color:r.REPUBLICAN_RED},"Nader, Ralph":{firstName:"Ralph",lastName:"Nader",party:"IND",color:r.INDEPENDENT_PURPLE},"Barr, Bob":{firstName:"Bob",lastName:"Barr",party:"LIB",color:r.LIBERTARIAN_GOLD},"Bush, George W.":{firstName:"George W.",lastName:"Bush",party:"R",color:r.REPUBLICAN_RED},"Kerry, John F.":{firstName:"John F.",lastName:"Kerry",party:"D",color:r.DEMOCRAT_BLUE},"Badnarik, Michael":{firstName:"Michael",lastName:"Badnarik",party:"LIB",color:r.LIBERTARIAN_GOLD}};e.default=n},function(t,e,i){"use strict";var r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&(t[r]=i[r])}return t};i(2);var n,o=i(8),s=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e.default=t,e}(i(7)),a=i(26),l=(n=a)&&n.__esModule?n:{default:n};var h=window.AFRAME,c=h.THREE;h.registerComponent("cartogram-renderer",{dependencies:["geo-projection"],schema:{maxExtrudeHeight:{default:1.6}},init:function(){this.geoProjectionComponent=this.el.components["geo-projection"],this.system=this.el.sceneEl.systems["geo-projection"],this.handleGeoDataReady=this.handleGeoDataReady.bind(this),this.handleElectionDataReady=this.handleElectionDataReady.bind(this),this.el.addEventListener("geo-data-ready",this.handleGeoDataReady),this.el.addEventListener("election-data-loaded",this.handleElectionDataReady)},remove:function(){this.el.removeEventListener("geo-data-ready",this.handleGeoDataReady),this.el.removeEventListener("election-data-loaded",this.handleElectionDataReady),this.clearMap(!0)},update:function(t){this.data.maxExtrudeHeight!==t.maxExtrudeHeight&&this.render()},handleGeoDataReady:function(){this.render()},handleElectionDataReady:function(t){var e=t.detail;this.votesByFipsCode=e.votesByFipsCode,this.maxTotalVoters=e.maxTotalVoters,this.render()},isReady:function(){return!(!this.votesByFipsCode||!this.geoProjectionComponent.geoJson)},render:function(){var t=this;if(this.clearMap(),this.isReady()){var e=(0,o.scaleLinear)().domain([0,this.maxTotalVoters]).range([0,this.data.maxExtrudeHeight]),i={};this.geoProjectionComponent.geoJson.features.forEach(function(n){var o=t.votesByFipsCode[n.id],s=t.system.renderToContext(n,t.geoProjectionComponent.projection).toShapes(),a=0,h=document.createElement("a-entity");h.setAttribute("id","state-"+n.id),h.setAttribute("class","state-selection-mask"),o.forEach(function(t){var o=t.votes/t.totalVoters,d=e(t.votes);if(!i[t.name]){var u=l.default[t.name];i[t.name]=r({geometry:new c.Geometry},u)}var p=i[t.name],v=p.geometry,m=void 0;m="15"===n.id||"02"===n.id||"26"===n.id?function(t,e,i,r){var n={amount:t,bevelEnabled:!1},o=new c.Geometry;return e.forEach(function(t){var e=new c.ExtrudeGeometry(t,n);e.computeBoundingBox();var s=e.boundingBox.getCenter(new c.Vector3);e.center(),e.scale(i,i,1),e.translate(s.x,s.y,s.z+r),o.merge(e)}),o}(d,s,o,a):function(t,e,i,r){var n={amount:t,bevelEnabled:!1},o=new c.ExtrudeGeometry(e,n);o.computeBoundingBox();var s=o.boundingBox.getCenter(new c.Vector3);return o.center(),o.scale(i,i,1),o.translate(s.x,s.y,s.z+r),o}(d,s,o,a),v.merge(m);var f=p.firstName+" "+p.lastName,b={state:n.properties.name,candidate:f,party:p.party,votes:t.votes,electoralVotes:t.electoralVotes,percentage:o,totalVotes:t.totalVoters,color:p.color.getHexString()},E=function(t,e,i){var r=new c.BufferGeometry;r.fromGeometry(t),r.computeBoundingBox();var n=r.boundingBox.getCenter(new c.Vector3);r.translate(-n.x,-n.y,-n.z);var o=new c.Mesh(r);o.name=e;var s=document.createElement("a-entity");return s.setAttribute("id",e),s.setAttribute("position",n),s.setAttribute("class","selectable"),s.setAttribute("selection-info",i),s.setAttribute("hoverable",""),s.setAttribute("material",{visible:!1,opacity:.25,transparent:!0,color:"white"}),s.setObject3D("mesh",o),s}(m,n.id+"-"+p.lastName,b);h.appendChild(E),a+=d}),t.el.appendChild(h)}),Object.keys(i).forEach(function(e){var r=i[e],n=new c.BufferGeometry;n.fromGeometry(r.geometry);var o=new c.MeshLambertMaterial({color:r.color}),s=new c.Mesh(n,o);t.el.setObject3D(e,s)});var n=this.system.renderToContext(this.geoProjectionComponent.geoJson,this.geoProjectionComponent.projection),a=new c.BufferGeometry,h=n.toVertices();a.addAttribute("position",new c.Float32BufferAttribute(h,3));var d=new c.LineBasicMaterial({color:s.DARK_GRAY}),u=new c.LineSegments(a,d);this.el.setObject3D("lines",u)}},clearMap:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];Object.keys(this.el.object3DMap).forEach(function(i){!e&&["hoverBox","selectionBox","outlineMap"].includes(i)||t.el.removeObject3D(i)}),this.el.querySelectorAll(".state-selection-mask").forEach(function(e){t.el.removeChild(e)})}})},function(t){t.exports={state:"CA",totalVoters:14181604}},function(t,e,i){"use strict";i(2);var r,n=i(28),o=(r=n)&&r.__esModule?r:{default:r};window.AFRAME.registerComponent("election-data-loader",{schema:{year:{type:"string"}},init:function(){this.handleDataLoaded=this.handleDataLoaded.bind(this),this.handleYearChanged=this.handleYearChanged.bind(this),this.el.sceneEl.addEventListener("year-changed",this.handleYearChanged),this.yearText=document.querySelector("#year")},remove:function(){this.el.sceneEl.removeEventListener("year-changed",this.handleYearChanged)},update:function(t){var e=this;this.data.year&&this.data.year!==t.year&&fetch("assets/federalelections"+this.data.year+".json").then(function(t){return t.json()}).then(this.handleDataLoaded).then(function(){e.yearText.setAttribute("value",e.data.year)}).catch(function(t){console.error(t)})},handleYearChanged:function(t){this.el.setAttribute("election-data-loader","year",t.detail.year)},handleDataLoaded:function(t){var e=t.reduce(function(t,e){return t[e.fips]||(t[e.fips]=[]),t[e.fips].push(e),t},{}),i=o.default.totalVoters;this.el.emit("election-data-loaded",{votesByFipsCode:e,maxTotalVoters:i})}})},function(t,e,i){"use strict";i(2),i(12),i(9),i(13),i(11),i(10),i(29),i(27),i(25),i(24),i(23),i(22),i(21),i(20),i(19),i(18),i(17),i(16)},function(t,e,i){t.exports=i(30)}]);
//# sourceMappingURL=app.bundle.js.map