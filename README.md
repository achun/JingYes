# JingYes

JingYes: 是一个基于 HTML5、CSS3 的前端框架，中文名 静夜思。在使用之前您需要了解以下几点：  

- 浏览器必须支持 HTML5、CSS3、JavaScript
- JingYes是通过HTML标签组合 class 进行设计的。这意味着JingYes的某些组件必须使用固定的代码结构。
- JingYes采用大量 display:inline-block 在网格等其他组件中替代 float:float 浮动效果，这种替代必须剔除掉代码中的某些多余空白才能正确体现。这个工作可以交给JS完成，JingYes提供了一个函数 clearTextNode() 来辅助此项工作。
- JingYes不会对浏览器兼容性进行特殊处理，也不支持浏览器特征CSS写法，仅支持标准CSS下的浏览器前缀写法。换句话说：只采用标准写法。
- JingYes在设计class名称的时候尽量满足逻辑性。
- JingYes在单位上采用pt、em，而不是px。

通过这些措施 JingYes 努力达到代码的契约性、简洁性、逻辑性。

简单的说：静夜思是具有代码结构契约性、并且只遵循 W3 标准的 WEB UI 框架。

# LICENSE:
under the MIT License: [http://achun.mit-license.org/2013](http://achun.mit-license.org/2013)