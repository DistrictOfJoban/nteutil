const _notoSansFont = Resources.readFont(Resources.id("mtr:font/noto-sans-cjk-tc-medium.otf"));
const _notoSerifFont = Resources.readFont(Resources.id("mtr:font/noto-serif-cjk-tc-semibold.ttf"));
const _notoSansSemiboldFont = Resources.readFont(Resources.id("mtr:font/noto-sans-semibold.ttf"));

const FontUtil = {
    getNotoSans() {
        return _notoSansFont;
    },
    getNotoSansSemibold() {
        return _notoSansSemiboldFont;
    },
    getNotoSerif() {
        return _notoSerifFont;
    },
    getFont(name) {
        if(name == "Noto Sans") return this.getNotoSans();
        if(name == "Noto Sans Semibold") return this.getNotoSansSemibold();
        if(name == "Noto Serif") return this.getNotoSerif();
        return Resource.getSystemFont(name);
    }
}