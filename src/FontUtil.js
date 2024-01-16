const FontUtil = {
    getNotoSans() {
        return Resources.readFont(Resources.id("mtr:font/noto-sans-cjk-tc-medium.otf"));
    },
    getNotoSansSemibold() {
        return Resources.readFont(Resources.id("mtr:font/noto-sans-semibold.ttf"));
    },
    getNotoSerif() {
        return Resources.getSystemFont("Noto Serif");
    }
}