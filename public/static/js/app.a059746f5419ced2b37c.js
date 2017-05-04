webpackJsonp([1],[,,,,,,,,,,function(e,t,i){i(49);var n=i(1)(i(15),i(58),null,null);e.exports=n.exports},,,function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(12),s=i(10),o=i.n(s),a=i(11),r=i.n(a);n.a.config.productionTip=!1,n.a.config.devtools=!0,n.a.use(r.a),new n.a({el:"#app",template:"<App/>",components:{App:o.a}}),document.getElementById("dtpckr").addEventListener("blur",function(){console.log("blurrrrred")})},function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var s=i(19),o=n(s),a=i(18),r=n(a),c={HOUR_TOKENS:["HH","H","hh","h","kk","k"],MINUTE_TOKENS:["mm","m"],SECOND_TOKENS:["ss","s"],APM_TOKENS:["A","a"]};t.default={name:"VueTimepicker",props:{value:{type:Object},hideClearButton:{type:Boolean},format:{type:String},minuteInterval:{type:Number},secondInterval:{type:Number},id:{type:String}},data:function(){return{hours:[],minutes:[],seconds:[],apms:[],showDropdown:!1,muteWatch:!1,hourType:"HH",minuteType:"mm",secondType:"",apmType:"",hour:"",minute:"",second:"",apm:"",fullValues:void 0}},computed:{displayTime:function(){var e=String(this.format||"HH:mm");return this.hour&&(e=e.replace(new RegExp(this.hourType,"g"),this.hour)),this.minute&&(e=e.replace(new RegExp(this.minuteType,"g"),this.minute)),this.second&&this.secondType&&(e=e.replace(new RegExp(this.secondType,"g"),this.second)),this.apm&&this.apmType&&(e=e.replace(new RegExp(this.apmType,"g"),this.apm)),e},showClearBtn:function(){return!!(this.hour&&""!==this.hour||this.minute&&""!==this.minute)}},watch:{format:"renderFormat",minuteInterval:function(e){this.renderList("minute",e)},secondInterval:function(e){this.renderList("second",e)},value:"readValues",displayTime:"fillValues"},methods:{formatValue:function(e,t){switch(e){case"H":case"m":case"s":return String(t);case"HH":case"mm":case"ss":return t<10?"0"+t:String(t);case"h":case"k":return String(t+1);case"hh":case"kk":return t+1<10?"0"+(t+1):String(t+1);default:return""}},checkAcceptingType:function(e,t,i){if(!e||!t||!t.length)return"";for(var n=0;n<e.length;n++)if(t.indexOf(e[n])>-1)return e[n];return i||""},renderFormat:function(e){e=e||this.format,e&&e.length||(e="HH:mm"),this.hourType=this.checkAcceptingType(c.HOUR_TOKENS,e,"HH"),this.minuteType=this.checkAcceptingType(c.MINUTE_TOKENS,e,"mm"),this.secondType=this.checkAcceptingType(c.SECOND_TOKENS,e),this.apmType=this.checkAcceptingType(c.APM_TOKENS,e),this.renderHoursList(),this.renderList("minute"),this.secondType&&this.renderList("second"),this.apmType&&this.renderApmList();var t=this;this.$nextTick(function(){t.readValues()})},renderHoursList:function(){var e="h"===this.hourType||"hh"===this.hourType?12:24;this.hours=[];for(var t=0;t<e;t++)this.hours.push(this.formatValue(this.hourType,t))},renderList:function(e,t){if("second"===e)t=t||this.secondInterval;else{if("minute"!==e)return;t=t||this.minuteInterval}0===t?t=60:t>60?(window.console.warn("`"+e+"-interval` should be less than 60. Current value is",t),t=1):t<1?(window.console.warn("`"+e+"-interval` should be NO less than 1. Current value is",t),t=1):t||(t=1),"minute"===e?this.minutes=[]:this.seconds=[];for(var i=0;i<60;i+=t)"minute"===e?this.minutes.push(this.formatValue(this.minuteType,i)):this.seconds.push(this.formatValue(this.secondType,i))},renderApmList:function(){this.apms=[],this.apmType&&(this.apms="A"===this.apmType?["AM","PM"]:["am","pm"])},readValues:function(){if(this.value&&!this.muteWatch){var e=JSON.parse((0,r.default)(this.value||{})),t=(0,o.default)(e);0!==t.length&&(t.indexOf(this.hourType)>-1&&(this.hour=e[this.hourType]),t.indexOf(this.minuteType)>-1&&(this.minute=e[this.minuteType]),t.indexOf(this.secondType)>-1?this.second=e[this.secondType]:this.second=0,t.indexOf(this.apmType)>-1&&(this.apm=e[this.apmType]),this.fillValues())}},fillValues:function(){var e={},t=this.hour,i=this.hourType,n=t||0===t?Number(t):"",s=this.isTwelveHours(i),o=!(!s||!this.apm)&&String(this.apm).toLowerCase();if(c.HOUR_TOKENS.forEach(function(a){if(a===i)return void(e[a]=t);var r=void 0,c=void 0;switch(a){case"H":case"HH":if(!String(n).length)return void(e[a]="");r=s?"pm"===o?n<12?n+12:n:n%12:n%24,e[a]="HH"===a&&r<10?"0"+r:String(r);break;case"k":case"kk":if(!String(n).length)return void(e[a]="");r=s?"pm"===o?n<12?n+12:n:12===n?24:n:0===n?24:n,e[a]="kk"===a&&r<10?"0"+r:String(r);break;case"h":case"hh":if(o)r=n,c=o||"am";else{if(!String(n).length)return e[a]="",e.a="",void(e.A="");n>11?(c="pm",r=12===n?12:n%12):(c=s?"":"am",r=n%12==0?12:n)}e[a]="hh"===a&&r<10?"0"+r:String(r),e.a=c,e.A=c.toUpperCase()}}),this.minute||0===this.minute){var a=Number(this.minute);e.m=String(a),e.mm=a<10?"0"+a:String(a)}else e.m="",e.mm="";if(this.second||0===this.second){var r=Number(this.second);e.s=String(r),e.ss=r<10?"0"+r:String(r)}else e.s="",e.ss="";this.fullValues=e,this.updateTimeValue(e),this.$emit("change",{data:e})},updateTimeValue:function(e){this.muteWatch=!0;var t=this,i=JSON.parse((0,r.default)(this.value||{})),n={};(0,o.default)(i).forEach(function(t){n[t]=e[t]}),this.$emit("input",n),this.$nextTick(function(){t.muteWatch=!1})},isTwelveHours:function(e){return"h"===e||"hh"===e},toggleDropdown:function(){this.showDropdown=!this.showDropdown},select:function(e,t){"hour"===e?this.hour=t:"minute"===e?this.minute=t:"second"===e?this.second=t:"apm"===e&&(this.apm=t)},clearTime:function(){this.hour="",this.minute="",this.second="",this.apm=""}},mounted:function(){this.renderFormat()}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(55),s=i.n(n),o=i(56),a=i.n(o);t.default={name:"app",components:{"add-food":s.a,"foods-container":a.a},data:function(){return{addingFood:!0}}}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=i(64),s=i.n(n),o=i(63),a=i.n(o),r=io.connect(window.location.origin),c={name:"add-food",components:{Datepicker:s.a,VueTimepicker:a.a},data:function(){return{foods:[],name:"",description:"",date:new Date,time:"",timeFormat:"h:mm a",timeValue:{h:((new Date).getHours()%12||12).toString(),mm:(new Date).getMinutes(),a:(new Date).getHours()>12?"pm":"am"},image:""}},methods:{addFood:function(e){if(e.preventDefault(),this.description&&this.name){var t={name:this.name,description:this.description,date:this.date,time:this.time,image:this.image};this.foods.push(t),r.emit("message",t),this.description=""}},uploadFile:function(e){var t=e.target.files||e.dataTransfer.files;t.length&&this.createImage(t[0])},createImage:function(e){var t=new FileReader,i=this;t.onload=function(e){i.image=e.target.result},t.readAsDataURL(e)},scrollToBottom:function(){this.$nextTick(function(){var e=this.$el.querySelector("#foods");e.scrollTop=e.scrollHeight})},loadedImage:function(e){console.log("the image loaded")}},mounted:function(){var e=this;console.log("mounted"),r.on("initialize",function(t){console.log("recieved socket initialize from server"),e.foods=t}),r.on("message",function(t){console.log("recieved new food from server"),console.log(t),console.log(c),e.foods.push(t)})}};t.default=c},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=io.connect(window.location.origin);t.default={name:"foods-container",data:function(){return{foods:[]}},methods:{scrollToBottom:function(){this.$nextTick(function(){var e=this.$el.querySelector("#foods");e.scrollTop=e.scrollHeight})}},mounted:function(){var e=this;console.log("mounted"),n.on("initialize",function(t){console.log("recieved socket initialize from server"),e.foods=t}),n.on("message",function(t){e.foods.push(t),console.log("recieved new food from server")})}}},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(e,t){},function(e,t){},function(e,t){},function(e,t){},,,function(e,t,i){i(51);var n=i(1)(i(16),i(60),null,null);e.exports=n.exports},function(e,t,i){i(50);var n=i(1)(i(17),i(59),"data-v-471f631a",null);e.exports=n.exports},function(e,t,i){i(52);var n=i(1)(i(14),i(61),null,null);e.exports=n.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"app"}},[i("div",{staticClass:"name"},[e._v("FREEdge")]),e._v(" "),i("div",{staticClass:"bio"},[e._v("NYU's Smart Community Sharing Fridge")]),e._v(" "),i("div",{staticClass:"actionContainer"},[i("a",{attrs:{href:"#give"},on:{click:function(t){e.addingFood=!e.addingFood}}},[i("div",{staticClass:"actionButton giveButton"},[e._v("GIVE")])]),e._v(" "),i("a",{directives:[{name:"smooth-scroll",rawName:"v-smooth-scroll",value:{duration:1250},expression:"{ duration: 1250 }"}],attrs:{href:"#receive"}},[i("div",{staticClass:"actionButton receiveButton"},[e._v("RECEIVE")])])]),e._v(" "),i("a",{directives:[{name:"smooth-scroll",rawName:"v-smooth-scroll",value:{duration:1250},expression:"{ duration: 1250 }"}],attrs:{href:"#receive"}},[i("div",{staticClass:"arrow"},[e._v("↓")])]),e._v(" "),i("div",{staticClass:"add-food-container",class:{addingFood:e.addingFood},on:{click:function(t){e.addingFood=!e.addingFood}}},[i("add-food")],1),e._v(" "),i("foods-container",{attrs:{id:"receive"}})],1)},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"foods-container"}},[i("span",[e._v("ALL FOODS")])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"add-food"},on:{click:function(e){e.stopPropagation()}}},[i("form",{on:{submit:e.addFood}},[i("div",{staticClass:"title"},[e._v("ADD FOOD")]),e._v(" "),i("div",{staticClass:"photo"},[i("label",{staticClass:"customFileButton",attrs:{for:"file-upload"}},[this.image?e._e():i("div",[i("i",{staticClass:"fa fa-camera",attrs:{"aria-hidden":"true"}})]),e._v(" "),this.image?i("img",{attrs:{src:this.image}}):e._e()]),e._v(" "),i("input",{attrs:{id:"file-upload",type:"file",name:"foodpic"},on:{change:e.uploadFile}})]),e._v(" "),i("div",{staticClass:"row2"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.name,expression:"name"}],attrs:{type:"text",placeholder:"name"},domProps:{value:e.name},on:{input:function(t){t.target.composing||(e.name=t.target.value)}}}),e._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:e.description,expression:"description"}],attrs:{type:"text",placeholder:"description"},domProps:{value:e.description},on:{input:function(t){t.target.composing||(e.description=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"row2"},[i("datepicker",{attrs:{"input-class":"betterCalStyle",id:"dtpckr",name:"uniquename"},model:{value:e.date,callback:function(t){e.date=t},expression:"date"}}),e._v(" "),i("vue-timepicker",{attrs:{format:e.timeFormat,"minute-interval":15,"hide-clear-button":""},model:{value:e.timeValue,callback:function(t){e.timeValue=t},expression:"timeValue"}})],1),e._v(" "),i("input",{staticClass:"submitButton",attrs:{type:"submit",value:"GIVE"}})])])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("span",{staticClass:"time-picker"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.displayTime,expression:"displayTime"}],staticClass:"display-time",attrs:{id:e.id,type:"text",readonly:""},domProps:{value:e.displayTime},on:{click:function(t){t.stopPropagation(),e.toggleDropdown(t)},input:function(t){t.target.composing||(e.displayTime=t.target.value)}}}),e._v(" "),e.hideClearButton?e._e():i("span",{directives:[{name:"show",rawName:"v-show",value:!e.showDropdown&&e.showClearBtn,expression:"!showDropdown && showClearBtn"}],staticClass:"clear-btn",on:{click:function(t){t.stopPropagation(),e.clearTime(t)}}},[e._v("×")]),e._v(" "),e.showDropdown?i("div",{staticClass:"time-picker-overlay",on:{click:function(t){t.stopPropagation(),e.toggleDropdown(t)}}}):e._e(),e._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.showDropdown,expression:"showDropdown"}],staticClass:"dropdown"},[i("div",{staticClass:"select-list"},[i("ul",{staticClass:"hours"},[i("li",{staticClass:"hint",domProps:{textContent:e._s(e.hourType)}}),e._v(" "),e._l(e.hours,function(t){return i("li",{class:{active:e.hour===t},domProps:{textContent:e._s(t)},on:{click:function(i){i.stopPropagation(),e.select("hour",t)}}})})],2),e._v(" "),i("ul",{staticClass:"minutes"},[i("li",{staticClass:"hint",domProps:{textContent:e._s(e.minuteType)}}),e._v(" "),e._l(e.minutes,function(t){return i("li",{class:{active:e.minute===t},domProps:{textContent:e._s(t)},on:{click:function(i){i.stopPropagation(),e.select("minute",t)}}})})],2),e._v(" "),e.secondType?i("ul",{staticClass:"seconds"},[i("li",{staticClass:"hint",domProps:{textContent:e._s(e.secondType)}}),e._v(" "),e._l(e.seconds,function(t){return i("li",{class:{active:e.second===t},domProps:{textContent:e._s(t)},on:{click:function(i){i.stopPropagation(),e.select("second",t)}}})})],2):e._e(),e._v(" "),e.apmType?i("ul",{staticClass:"apms"},[i("li",{staticClass:"hint",domProps:{textContent:e._s(e.apmType)}}),e._v(" "),e._l(e.apms,function(t){return i("li",{class:{active:e.apm===t},domProps:{textContent:e._s(t)},on:{click:function(i){i.stopPropagation(),e.select("apm",t)}}})})],2):e._e()])])])},staticRenderFns:[]}}],[13]);
//# sourceMappingURL=app.a059746f5419ced2b37c.js.map