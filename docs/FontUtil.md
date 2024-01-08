# FontUtil
Provide a couple of functions to obtain an awt font.
The fonts are preloaded when you include this file in your script, and are reused when you call the functions below, as such this should have little impact on performance.

## Functions
### getNotoSans(): Font
Returns the **Noto Sans CJK font** that is bundled with the **NTE Mod**. This supports CJK Characters.

### getNotoSansSemibold(): Font
Returns the **Noto Sans Semibold font** that is bundled with the **MTR Mod**. This does not support CJK Characters.

### getNotoSerif(): Font
Returns the **Noto Serif CJK** that is bundled with the **MTR Mod**. This does support CJK Characters.

### getFont(name: String): Font
This is equivalent to NTE's `Resources.getSystemFont(name)`, with the exception that the following will be returned based on the `name` variable:
- `Noto Sans` -> getNotoSans()
- `Noto Sans Semibold` -> getNotoSansSemibold()
- `Noto Serif` -> getNotoSerif()