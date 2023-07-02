"use strict";(self.webpackChunkaecsocket_github_io=self.webpackChunkaecsocket_github_io||[]).push([[67],{3905:(e,n,t)=>{t.d(n,{Zo:()=>g,kt:()=>m});var a=t(7294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function r(e,n){if(null==e)return{};var t,a,o=function(e,n){if(null==e)return{};var t,a,o={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=a.createContext({}),c=function(e){var n=a.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},g=function(e){var n=c(e.components);return a.createElement(l.Provider,{value:n},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,o=e.mdxType,s=e.originalType,l=e.parentName,g=r(e,["components","mdxType","originalType","parentName"]),p=c(t),d=o,m=p["".concat(l,".").concat(d)]||p[d]||u[d]||s;return t?a.createElement(m,i(i({ref:n},g),{},{components:t})):a.createElement(m,i({ref:n},g))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var s=t.length,i=new Array(s);i[0]=d;var r={};for(var l in n)hasOwnProperty.call(n,l)&&(r[l]=n[l]);r.originalType=e,r[p]="string"==typeof e?e:o,i[1]=r;for(var c=2;c<s;c++)i[c]=t[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6260:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>r,toc:()=>c});var a=t(7462),o=(t(7294),t(3905));const s={sidebar_position:3},i="API",r={unversionedId:"glossa/api",id:"glossa/api",title:"API",description:"The Glossa API is designed entirely around Kotlin and its DSL capabilities. Although the API can be",source:"@site/docs/glossa/api.md",sourceDirName:"glossa",slug:"/glossa/api",permalink:"/glossa/api",draft:!1,editUrl:"https://github.com/aecsocket/aecsocket.github.io/blob/main/docs/glossa/api.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"sidebar",previous:{title:"ICU Guide",permalink:"/glossa/icu"},next:{title:"Alexandria",permalink:"/alexandria/"}},l={},c=[{value:"Usage",id:"usage",level:2},{value:"Glossa",id:"glossa",level:2},{value:"Message proxies",id:"message-proxies",level:2},{value:"Configurate",id:"configurate",level:2}],g={toc:c},p="wrapper";function u(e){let{components:n,...t}=e;return(0,o.kt)(p,(0,a.Z)({},g,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"api"},"API"),(0,o.kt)("p",null,"The Glossa API is designed entirely around Kotlin and its DSL capabilities. Although the API can be\nused in Java, many parts will be less developer-friendly. It also uses Java Locale objects as the main\nsource of locale-specific info, so make sure you can get a Locale object for whatever language you\nare working with."),(0,o.kt)("h2",{id:"usage"},"Usage"),(0,o.kt)("p",null,"See ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/aecsocket/glossa"},"the repository page")," to get:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"the latest version"),(0,o.kt)("li",{parentName:"ul"},"the artifact coordinates for Maven/Gradle")),(0,o.kt)("h2",{id:"glossa"},"Glossa"),(0,o.kt)("p",null,"The main type you will be working with is ",(0,o.kt)("inlineCode",{parentName:"p"},"Glossa"),", which provides methods for generating translations.\nTo create an implementation, use ",(0,o.kt)("inlineCode",{parentName:"p"},"glossaStandard"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'// specify a default locale\nval english: Locale = Locale.forLanguageTag("en-US")\n\n// specify the strategy for when a message doesn\'t exist for a given message key\n// `Default` will simply output the key itself\n// use `JavaLogging(Logger)` to output the key and a warning to the logger\n// or `Logging((String) -> Unit)` to output the key and a warning to the logging function provided\nval invalidMessageProvider: InvalidMessageProvider = InvalidMessageProvider.Default\n\n// create the Glossa instance\nval glossa: Glossa = glossaStandard(\n    defaultLocale = english,\n    invalidMessageProvider = invalidMessageProvider,\n) {\n    // DSL scope here\n}\n')),(0,o.kt)("p",null,"You can then use the functions inside the DSL scope to add data for the engine to use:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'glossaStandard(...) {\n    substitutions {\n        // to insert a raw substitution\n        substitution("icon_info", Component.text("(!)", NamedTextColor.GRAY))\n        // to insert a substitution parsed by MiniMessage\n        miniMessageSubstitution("icon_info", "<gray>(!)")\n    }\n\n    styles {\n        style("style_info", Style.style(NamedTextColor.GRAY))\n    }\n\n    translation(english) {\n        message("hello_world", "Hello world!")\n\n        messageList("splashes",\n          "Unleash Your Power!",\n          "Embark on an Epic Journey!",\n          "Join the Battle and Conquer!",\n        )\n\n        section("a_section") {\n            message("message_in_section", "This is a message in a section")\n\n            section("nested") {\n                message("msg", "Message in a nested section - a_section.nested.msg")\n            }\n        }\n    }\n}\n')),(0,o.kt)("h2",{id:"message-proxies"},"Message proxies"),(0,o.kt)("p",null,"Glossa allows creating a rich, type-safe message generation API from a Kotlin interface.  Use ",(0,o.kt)("inlineCode",{parentName:"p"},"Glossa.messageProxy<T>()")," to\ncreate a ",(0,o.kt)("inlineCode",{parentName:"p"},"MessageProxy<T>"),", on which you can use ",(0,o.kt)("inlineCode",{parentName:"p"},".default")," or ",(0,o.kt)("inlineCode",{parentName:"p"},".forLocale(Locale)")," to get a ",(0,o.kt)("inlineCode",{parentName:"p"},"T")," object representing your\nmessages."),(0,o.kt)("p",null,"Function and section names automatically map to ",(0,o.kt)("inlineCode",{parentName:"p"},"snake_case")," names, unless specified otherwise."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'// typealias Message = List<Component>\n\ninterface Messages {\n    // automatically maps to the message key `hello_world`\n    fun helloWorld(): Message\n\n    // maps to messages under `the_section`\n    val theSection: TheSection\n    interface TheSection {\n        fun aMessageList(): List<Message>\n    }\n\n    @MessageKey("another_key") // remap this function to point to a different key\n    fun withSpecialKey(): Message\n\n    @SectionKey("the_section") // remap this property to point to a different section\n    val sectionWithSpecialKey: TheSection\n\n    // provide arguments as well\n    fun withArguments(\n        // equivalent to the argument `replace("text", ...)`\n        text: Component,\n        // equivalent to the argument `format("coins", ...)`\n        coins: Int,\n        // `format("player_health", ...)`\n        @Placeholder("player_health") health: Float,\n        // `format("date_sold", ...)`\n        dateSold: Date,\n    )\n}\n\nval messages: MessageProxy<Messages> = glossa.messageProxy<Messages>()\n\nval forEnglish = messages.forLocale(english)\n\nval msg: Message = forEnglish.helloWorld() // generates `hello_world`\n\nval list: List<Message> = forEnglish.theSection.aMessageList()\n\nval msg2 = forEnglish.withArguments(\n    text = Component.text("Hello"),\n    coins = 350,\n    health = 0.5f,\n    dateSold = Date(0),\n)\n')),(0,o.kt)("h2",{id:"configurate"},"Configurate"),(0,o.kt)("p",null,"Using the Configurate module, you can automatically load data from ",(0,o.kt)("inlineCode",{parentName:"p"},"ConfigurationNode"),"s in the model DSL, via model extensions:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-kotlin"},'val langFile = dataFolder.resolve("en-US.yml")\n\nglossaStandard(...) {\n    fromConfigLoader(\n        YamlConfigLoader.builder()\n            .file(langFile)\n            .build()\n    )\n}\n')),(0,o.kt)("p",null,"This uses the format as described in ",(0,o.kt)("a",{parentName:"p",href:"/glossa/format"},"Format"),"."))}u.isMDXComponent=!0}}]);