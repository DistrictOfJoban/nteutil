const FontUtil = {
    getNotoSans() {
        return Resources.readFont(Resources.id("mtr:font/noto-sans-cjk-tc-medium.otf"));
    },
    getNotoSansSemibold() {
        return Resources.readFont(Resources.id("mtr:font/noto-serif-cjk-tc-semibold.ttf"));
    },
    getNotoSerif() {
        return Resource.getSystemFont("Noto Serif");
    },
    getFont(name) {
        if(name == "Noto Sans") return this.getNotoSans();
        if(name == "Noto Sans Semibold") return this.getNotoSansSemibold();
        if(name == "Noto Serif") return this.getNotoSerif();
        return Resource.getSystemFont(name);
    }
}