# FontUtil
Provide a couple of functions to read awt font.  

## Functions
### getNotoSans(): Font
Returns the **Noto Sans CJK font** that is bundled with the **NTE Mod**, which supports CJK Characters.  
This is equivalent to `Resources.readFont(Resources.id("mtr:font/noto-sans-cjk-tc-medium.otf"))`.

### getNotoSansSemibold(): Font
Returns the **Noto Sans Semibold font** that is bundled with the **MTR Mod**, which does not support CJK Characters.  
This is equivalent to `Resources.readFont(Resources.id("mtr:font/noto-serif-cjk-tc-semibold.ttf"))`.

### getNotoSerif(): Font
Returns the **Noto Serif CJK** that is bundled with the **MTR Mod**, which does support CJK Characters.  
This is equivalent to `Resources.getSystemFont("Noto Serif")`.