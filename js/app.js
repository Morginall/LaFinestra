(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if ("error" !== this._dataValue) {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && 0 === focusedIndex) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    function formQuantity() {
        document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest("[data-quantity-plus]") || targetElement.closest("[data-quantity-minus]")) {
                const valueElement = targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]");
                let value = parseInt(valueElement.value);
                if (targetElement.hasAttribute("data-quantity-plus")) {
                    value++;
                    if (+valueElement.dataset.quantityMax && +valueElement.dataset.quantityMax < value) value = valueElement.dataset.quantityMax;
                } else {
                    --value;
                    if (+valueElement.dataset.quantityMin) {
                        if (+valueElement.dataset.quantityMin > value) value = valueElement.dataset.quantityMin;
                    } else if (value < 0) value = 0;
                }
                targetElement.closest("[data-quantity]").querySelector("[data-quantity-value]").value = value;
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    var summ = {
        allSumm: 0,
        cashSumm: 0,
        cardSumm: 0
    };
    var allSummValue = document.getElementById("allSumm");
    var cashSummValue = document.getElementById("cashSumm");
    var cardSummValue = document.getElementById("cardSumm");
    var beforeMoneyValue = 0;
    var prices = {
        espresso: 21,
        americano: 21,
        dopio: 37,
        kapucinoS: 34,
        kapucinoM: 40,
        kapucinoL: 47,
        latteS: 34,
        latteM: 40,
        latteL: 47,
        rafS: 47,
        rafM: 57,
        fletWhiteS: 39,
        fletWhiteM: 47,
        cream: 6,
        syrup: 6,
        milk: 6,
        vegetableMilk: 18,
        lactoseFreeMilk: 10,
        peanut: 6,
        coconutShavings: 6,
        marshmellow: 8,
        oreoCoffe: 57,
        lionCoffe: 57,
        bananaCoffe: 57,
        coconutCoffe: 57,
        kendyNutCoffe: 57,
        mmsCoffe: 57,
        cherryCoffe: 57,
        glyaseCoffe: 55,
        kakaoRainbowCoffe: 55,
        coldLatte: 45,
        tigerLatte: 49,
        fruitMexican: 40,
        tee: 20,
        ekoTee: 39,
        chokolate: 39,
        chokolatePlus: 45,
        mulledWine: 39,
        cacaoNatural: 39,
        nesquikS: 27,
        nesquikM: 33,
        matcha: 25,
        matchaLatte: 35,
        kapucinoSLactoseFree: 38,
        kapucinoMLactoseFree: 55,
        kapucinoLLactoseFree: 65,
        latteSLactoseFree: 38,
        latteMLactoseFree: 55,
        latteLLactoseFree: 65,
        nesquikSLactoseFree: 40,
        cacaoNaturalLactoseFree: 55,
        fletWhiteSLactoseFree: 46,
        kapucinoSVegetable: 57,
        kapucinoMVegetable: 78,
        latteSVegetable: 57,
        latteMVegetable: 78,
        cacaoNaturalVegetable: 100,
        fletWhiteSVegetable: 57,
        jarIceCream: 100,
        jarSorbet: 100,
        iceCream001: 30,
        iceCream002: 30
    };
    var count = {
        espresso: Number(),
        americano: Number(),
        dopio: Number(),
        kapucinoS: Number(),
        kapucinoM: Number(),
        kapucinoL: Number(),
        latteS: Number(),
        latteM: Number(),
        latteL: Number(),
        rafS: Number(),
        rafM: Number(),
        fletWhiteS: Number(),
        fletWhiteM: Number(),
        cream: Number(),
        syrup: Number(),
        milk: Number(),
        vegetableMilk: Number(),
        lactoseFreeMilk: Number(),
        peanut: Number(),
        coconutShavings: Number(),
        marshmellow: Number(),
        oreoCoffe: Number(),
        lionCoffe: Number(),
        bananaCoffe: Number(),
        coconutCoffe: Number(),
        kendyNutCoffe: Number(),
        mmsCoffe: Number(),
        cherryCoffe: Number(),
        glyaseCoffe: Number(),
        kakaoRainbowCoffe: Number(),
        coldLatte: Number(),
        tigerLatte: Number(),
        fruitMexican: Number(),
        tee: Number(),
        ekoTee: Number(),
        chokolate: Number(),
        chokolatePlus: Number(),
        mulledWine: Number(),
        cacaoNatural: Number(),
        nesquikS: Number(),
        nesquikM: Number(),
        matcha: Number(),
        matchaLatte: Number(),
        kapucinoSLactoseFree: Number(),
        kapucinoMLactoseFree: Number(),
        kapucinoLLactoseFree: Number(),
        latteSLactoseFree: Number(),
        latteMLactoseFree: Number(),
        latteLLactoseFree: Number(),
        nesquikSLactoseFree: Number(),
        cacaoNaturalLactoseFree: Number(),
        fletWhiteSLactoseFree: Number(),
        kapucinoSVegetable: Number(),
        kapucinoMVegetable: Number(),
        latteSVegetable: Number(),
        latteMVegetable: Number(),
        cacaoNaturalVegetable: Number(),
        fletWhiteSVegetable: Number(),
        jarIceCream: Number(),
        jarSorbet: Number(),
        iceCream001: Number(),
        iceCream001PCS2: Number(),
        iceCream001PCS3: Number(),
        iceCream002: Number(),
        iceCream002PCS2: Number(),
        iceCream002PCS3: Number()
    };
    var chek = document.getElementById("chekWindow");
    var chekSumm = Number();
    var espressoSumm = Number();
    var americanoSumm = Number();
    var dopioSumm = Number();
    var kapucinoSSumm = Number();
    var kapucinoMSumm = Number();
    var kapucinoLSumm = Number();
    var latteSSumm = Number();
    var latteMSumm = Number();
    var latteLSumm = Number();
    var rafSSumm = Number();
    var rafMSumm = Number();
    var fletWhiteSSumm = Number();
    var fletWhiteMSumm = Number();
    var creamSumm = Number();
    var syrupSumm = Number();
    var milkSumm = Number();
    var vegetableMilkSumm = Number();
    var lactoseFreeMilkSumm = Number();
    var peanutSumm = Number();
    var coconutShavingsSumm = Number();
    var marshmellowSumm = Number();
    var oreoCoffeSumm = Number();
    var lionCoffeSumm = Number();
    var bananaCoffeSumm = Number();
    var coconutCoffeSumm = Number();
    var kendyNutCoffeSumm = Number();
    var mmsCoffeSumm = Number();
    var cherryCoffeSumm = Number();
    var glyaseCoffeSumm = Number();
    var kakaoRainbowCoffeSumm = Number();
    var coldLatteSumm = Number();
    var tigerLatteSumm = Number();
    var fruitMexicanSumm = Number();
    var teeSumm = Number();
    var ekoTeeSumm = Number();
    var chokolateSumm = Number();
    var chokolatePlusSumm = Number();
    var mulledWineSumm = Number();
    var cacaoNaturalSumm = Number();
    var nesquikSSumm = Number();
    var nesquikMSumm = Number();
    var matchaSumm = Number();
    var matchaLatteSumm = Number();
    var kapucinoSLactoseFreeSumm = Number();
    var kapucinoMLactoseFreeSumm = Number();
    var kapucinoLLactoseFreeSumm = Number();
    var latteSLactoseFreeSumm = Number();
    var latteMLactoseFreeSumm = Number();
    var latteLLactoseFreeSumm = Number();
    var nesquikSLactoseFreeSumm = Number();
    var cacaoNaturalLactoseFreeSumm = Number();
    var fletWhiteSLactoseFreeSumm = Number();
    var kapucinoSVegetableSumm = Number();
    var kapucinoMVegetableSumm = Number();
    var latteSVegetableSumm = Number();
    var latteMVegetableSumm = Number();
    var cacaoNaturalVegetableSumm = Number();
    var fletWhiteSVegetableSumm = Number();
    var jarIceCreamSumm = Number();
    var jarSorbetSumm = Number();
    var iceCream001Summ = Number();
    var iceCream002Summ = Number();
    var reportEspressoValue = document.getElementById("reportEspresso");
    var reportAmericanoValue = document.getElementById("reportAmericano");
    var reportDopioValue = document.getElementById("reportDopio");
    var reportKapucinoSValue = document.getElementById("reportKapucinoS");
    var reportKapucinoMValue = document.getElementById("reportKapucinoM");
    var reportKapucinoLValue = document.getElementById("reportKapucinoL");
    var reportLatteSValue = document.getElementById("reportLatteS");
    var reportLatteMValue = document.getElementById("reportLatteM");
    var reportLatteLValue = document.getElementById("reportLatteL");
    var reportRafSValue = document.getElementById("reportRafS");
    var reportRafMValue = document.getElementById("reportRafM");
    var reportFletWhiteSValue = document.getElementById("reportFletWhiteS");
    var reportFletWhiteMValue = document.getElementById("reportFletWhiteM");
    var reportCreamValue = document.getElementById("reportCream");
    var reportSyrupValue = document.getElementById("reportSyrup");
    var reportMilkValue = document.getElementById("reportMilk");
    var reportVegetableMilkValue = document.getElementById("reportVegetableMilk");
    var reportLactoseFreeMilkValue = document.getElementById("reportLactoseFreeMilk");
    var reportPeanutValue = document.getElementById("reportPeanut");
    var reportCoconutShavingsValue = document.getElementById("reportCoconutShavings");
    var reportMarshmellowValue = document.getElementById("reportMarshmellow");
    var reportOreoCoffeValue = document.getElementById("reportOreoCoffe");
    var reportLionCoffeValue = document.getElementById("reportLionCoffe");
    var reportBananaCoffeValue = document.getElementById("reportBananaCoffe");
    var reportCoconutCoffeValue = document.getElementById("reportCoconutCoffe");
    var reportKendyNutCoffeValue = document.getElementById("reportKendyNutCoffe");
    var reportMmsCoffeValue = document.getElementById("reportMmsCoffe");
    var reportCherryCoffeValue = document.getElementById("reportCherryCoffe");
    var reportGlyaseCoffeValue = document.getElementById("reportGlyaseCoffe");
    var reportKakaoRainbowCoffeValue = document.getElementById("reportKakaoRainbowCoffe");
    var reportColdLatteValue = document.getElementById("reportColdLatte");
    var reportTigerLatteValue = document.getElementById("reportTigerLatte");
    var reportFruitMexicanValue = document.getElementById("reportFruitMexican");
    var reportTeeValue = document.getElementById("reportTee");
    var reportEkoTeeValue = document.getElementById("reportEkoTee");
    var reportChokolateValue = document.getElementById("reportChokolate");
    var reportChokolatePlusValue = document.getElementById("reportChokolatePlus");
    var reportMulledWineValue = document.getElementById("reportMulledWine");
    var reportCacaoNaturalValue = document.getElementById("reportCacaoNatural");
    var reportNesquikSValue = document.getElementById("reportNesquikS");
    var reportNesquikMValue = document.getElementById("reportNesquikM");
    var reportMatchaValue = document.getElementById("reportMatcha");
    var reportMatchaLatteValue = document.getElementById("reportMatchaLatte");
    var reportKapucinoSLactoseFreeValue = document.getElementById("reportKapucinoSLactoseFree");
    var reportKapucinoMLactoseFreeValue = document.getElementById("reportKapucinoMLactoseFree");
    var reportKapucinoLLactoseFreeValue = document.getElementById("reportKapucinoLLactoseFree");
    var reportLatteSLactoseFreeValue = document.getElementById("reportLatteSLactoseFree");
    var reportLatteMLactoseFreeValue = document.getElementById("reportLatteMLactoseFree");
    var reportLatteLLactoseFreeValue = document.getElementById("reportLatteLLactoseFree");
    var reportNesquikSLactoseFreeValue = document.getElementById("reportNesquikSLactoseFree");
    var reportCacaoNaturalLactoseFreeValue = document.getElementById("reportCacaoNaturalLactoseFree");
    var reportFletWhiteSLactoseFreeValue = document.getElementById("reportFletWhiteSLactoseFree");
    var reportKapucinoSVegetableValue = document.getElementById("reportKapucinoSVegetable");
    var reportKapucinoMVegetableValue = document.getElementById("reportKapucinoMVegetable");
    var reportLatteSVegetableValue = document.getElementById("reportLatteSVegetable");
    var reportLatteMVegetableValue = document.getElementById("reportLatteMVegetable");
    var reportCacaoNaturalVegetableValue = document.getElementById("reportCacaoNaturalVegetable");
    var reportFletWhiteSVegetableValue = document.getElementById("reportFletWhiteSVegetable");
    var reportJarIceCreamValue = document.getElementById("reportJarIceCream");
    var reportJarSorbetValue = document.getElementById("reportJarSorbet");
    var reportIceCream001Value = document.getElementById("reportIceCream001");
    var reportIceCream001PCS2Value = document.getElementById("reportIceCream001PCS2");
    var reportIceCream001PCS3Value = document.getElementById("reportIceCream001PCS3");
    var reportIceCream002Value = document.getElementById("reportIceCream002");
    var reportIceCream002PCS2Value = document.getElementById("reportIceCream002PCS2");
    var reportIceCream002PCS3Value = document.getElementById("reportIceCream002PCS3");
    const sell = document.getElementById("sell");
    const confirmCash = document.getElementById("confirmCash");
    const confirmCard = document.getElementById("confirmCard");
    const beforeMoneyButton = document.getElementById("beforeMoneyButton");
    const espressoButton = document.getElementById("espressoButton");
    const americanoButton = document.getElementById("americanoButton");
    const dopioButton = document.getElementById("dopioButton");
    const kapucinoSButton = document.getElementById("kapucinoSButton");
    const kapucinoMButton = document.getElementById("kapucinoMButton");
    const kapucinoLButton = document.getElementById("kapucinoLButton");
    const latteSButton = document.getElementById("latteSButton");
    const latteMButton = document.getElementById("latteMButton");
    const latteLButton = document.getElementById("latteLButton");
    const rafSButton = document.getElementById("rafSButton");
    const rafMButton = document.getElementById("rafMButton");
    const fletWhiteSButton = document.getElementById("fletWhiteSButton");
    const fletWhiteMButton = document.getElementById("fletWhiteMButton");
    const creamButton = document.getElementById("creamButton");
    const syrupButton = document.getElementById("syrupButton");
    const milkButton = document.getElementById("milkButton");
    const vegetableMilkButton = document.getElementById("vegetableMilkButton");
    const lactoseFreeMilkButton = document.getElementById("lactoseFreeMilkButton");
    const peanutButton = document.getElementById("peanutButton");
    const coconutShavingsButton = document.getElementById("coconutShavingsButton");
    const marshmellowButton = document.getElementById("marshmellowButton");
    const oreoCoffeButton = document.getElementById("oreoCoffeButton");
    const lionCoffeButton = document.getElementById("lionCoffeButton");
    const bananaCoffeButton = document.getElementById("bananaCoffeButton");
    const coconutCoffeButton = document.getElementById("coconutCoffeButton");
    const kendyNutCoffeButton = document.getElementById("kendyNutCoffeButton");
    const mmsCoffeButton = document.getElementById("mmsCoffeButton");
    const cherryCoffeButton = document.getElementById("cherryCoffeButton");
    const glyaseCoffeButton = document.getElementById("glyaseCoffeButton");
    const kakaoRainbowCoffeButton = document.getElementById("kakaoRainbowCoffeButton");
    const coldLatteButton = document.getElementById("coldLatteButton");
    const tigerLatteButton = document.getElementById("tigerLatteButton");
    const fruitMexicanButton = document.getElementById("fruitMexicanButton");
    const teeButton = document.getElementById("teeButton");
    const ekoTeeButton = document.getElementById("ekoTeeButton");
    const chokolateButton = document.getElementById("chokolateButton");
    const chokolatePlusButton = document.getElementById("chokolatePlusButton");
    const mulledWineButton = document.getElementById("mulledWineButton");
    const cacaoNaturalButton = document.getElementById("cacaoNaturalButton");
    const nesquikSButton = document.getElementById("nesquikSButton");
    const nesquikMButton = document.getElementById("nesquikMButton");
    const matchaButton = document.getElementById("matchaButton");
    const matchaLatteButton = document.getElementById("matchaLatteButton");
    const kapucinoSLactoseFreeButton = document.getElementById("kapucinoSLactoseFreeButton");
    const kapucinoMLactoseFreeButton = document.getElementById("kapucinoMLactoseFreeButton");
    const kapucinoLLactoseFreeButton = document.getElementById("kapucinoLLactoseFreeButton");
    const latteSLactoseFreeButton = document.getElementById("latteSLactoseFreeButton");
    const latteMLactoseFreeButton = document.getElementById("latteMLactoseFreeButton");
    const latteLLactoseFreeButton = document.getElementById("latteLLactoseFreeButton");
    const nesquikSLactoseFreeButton = document.getElementById("nesquikSLactoseFreeButton");
    const cacaoNaturalLactoseFreeButton = document.getElementById("cacaoNaturalLactoseFreeButton");
    const fletWhiteSLactoseFreeButton = document.getElementById("fletWhiteSLactoseFreeButton");
    const kapucinoSVegetableButton = document.getElementById("kapucinoSVegetableButton");
    const kapucinoMVegetableButton = document.getElementById("kapucinoMVegetableButton");
    const latteSVegetableButton = document.getElementById("latteSVegetableButton");
    const latteMVegetableButton = document.getElementById("latteMVegetableButton");
    const cacaoNaturalVegetableButton = document.getElementById("cacaoNaturalVegetableButton");
    const fletWhiteSVegetableButton = document.getElementById("fletWhiteSVegetableButton");
    const jarIceCreamButton = document.getElementById("jarIceCreamButton");
    const jarSorbetButton = document.getElementById("jarSorbetButton");
    const iceCream001Button = document.getElementById("iceCream001Button");
    const iceCream002Button = document.getElementById("iceCream002Button");
    function chekCalc() {
        chekSumm = 0;
        chekSumm = espressoSumm + americanoSumm + dopioSumm + kapucinoSSumm + kapucinoMSumm + kapucinoLSumm + latteSSumm + latteMSumm + latteLSumm + rafSSumm + rafMSumm + fletWhiteSSumm + fletWhiteMSumm + peanutSumm + coconutShavingsSumm + marshmellowSumm + creamSumm + syrupSumm + milkSumm + vegetableMilkSumm + lactoseFreeMilkSumm + oreoCoffeSumm + lionCoffeSumm + bananaCoffeSumm + coconutCoffeSumm + kendyNutCoffeSumm + mmsCoffeSumm + cherryCoffeSumm + glyaseCoffeSumm + kakaoRainbowCoffeSumm + coldLatteSumm + tigerLatteSumm + fruitMexicanSumm + teeSumm + ekoTeeSumm + chokolateSumm + chokolatePlusSumm + mulledWineSumm + cacaoNaturalSumm + nesquikSSumm + nesquikMSumm + matchaSumm + matchaLatteSumm + kapucinoSLactoseFreeSumm + kapucinoMLactoseFreeSumm + kapucinoLLactoseFreeSumm + latteSLactoseFreeSumm + latteMLactoseFreeSumm + latteLLactoseFreeSumm + nesquikSLactoseFreeSumm + cacaoNaturalLactoseFreeSumm + fletWhiteSLactoseFreeSumm + kapucinoSVegetableSumm + kapucinoMVegetableSumm + latteSVegetableSumm + latteMVegetableSumm + cacaoNaturalVegetableSumm + fletWhiteSVegetableSumm + jarIceCreamSumm + jarSorbetSumm + iceCream001Summ + iceCream002Summ;
        chek.value = chekSumm;
    }
    function espresso() {
        count.espresso = document.getElementById("espresso").value;
        espressoSumm = count.espresso * prices.espresso;
        chekCalc();
    }
    espressoButton.addEventListener("click", espresso);
    function americano() {
        count.americano = document.getElementById("americano").value;
        americanoSumm = count.americano * prices.americano;
        chekCalc();
    }
    americanoButton.addEventListener("click", americano);
    function dopio() {
        count.dopio = document.getElementById("dopio").value;
        dopioSumm = count.dopio * prices.dopio;
        chekCalc();
    }
    dopioButton.addEventListener("click", dopio);
    function kapucinoS() {
        count.kapucinoS = document.getElementById("kapucinoS").value;
        kapucinoSSumm = count.kapucinoS * prices.kapucinoS;
        chekCalc();
    }
    kapucinoSButton.addEventListener("click", kapucinoS);
    function kapucinoM() {
        count.kapucinoM = document.getElementById("kapucinoM").value;
        kapucinoMSumm = count.kapucinoM * prices.kapucinoM;
        chekCalc();
    }
    kapucinoMButton.addEventListener("click", kapucinoM);
    function kapucinoL() {
        count.kapucinoL = document.getElementById("kapucinoL").value;
        kapucinoLSumm = count.kapucinoL * prices.kapucinoL;
        chekCalc();
    }
    kapucinoLButton.addEventListener("click", kapucinoL);
    function latteS() {
        count.latteS = document.getElementById("latteS").value;
        latteSSumm = count.latteS * prices.latteS;
        chekCalc();
    }
    latteSButton.addEventListener("click", latteS);
    function latteM() {
        count.latteM = document.getElementById("latteM").value;
        latteMSumm = count.latteM * prices.latteM;
        chekCalc();
    }
    latteMButton.addEventListener("click", latteM);
    function latteL() {
        count.latteL = document.getElementById("latteL").value;
        latteLSumm = count.latteL * prices.latteL;
        chekCalc();
    }
    latteLButton.addEventListener("click", latteL);
    function rafS() {
        count.rafS = document.getElementById("rafS").value;
        rafSSumm = count.rafS * prices.rafS;
        chekCalc();
    }
    rafSButton.addEventListener("click", rafS);
    function rafM() {
        count.rafM = document.getElementById("rafM").value;
        rafMSumm = count.rafM * prices.rafM;
        chekCalc();
    }
    rafMButton.addEventListener("click", rafM);
    function fletWhiteS() {
        count.fletWhiteS = document.getElementById("fletWhiteS").value;
        fletWhiteSSumm = count.fletWhiteS * prices.fletWhiteS;
        chekCalc();
    }
    fletWhiteSButton.addEventListener("click", fletWhiteS);
    function fletWhiteM() {
        count.fletWhiteM = document.getElementById("fletWhiteM").value;
        fletWhiteMSumm = count.fletWhiteM * prices.fletWhiteM;
        chekCalc();
    }
    fletWhiteMButton.addEventListener("click", fletWhiteM);
    function cream() {
        count.cream = document.getElementById("cream").value;
        creamSumm = count.cream * prices.cream;
        chekCalc();
    }
    creamButton.addEventListener("click", cream);
    function syrup() {
        count.syrup = document.getElementById("syrup").value;
        syrupSumm = count.syrup * prices.syrup;
        chekCalc();
    }
    syrupButton.addEventListener("click", syrup);
    function milk() {
        count.milk = document.getElementById("milk").value;
        milkSumm = count.milk * prices.milk;
        chekCalc();
    }
    milkButton.addEventListener("click", milk);
    function vegetableMilk() {
        count.vegetableMilk = document.getElementById("vegetableMilk").value;
        vegetableMilkSumm = count.vegetableMilk * prices.vegetableMilk;
        chekCalc();
    }
    vegetableMilkButton.addEventListener("click", vegetableMilk);
    function lactoseFreeMilk() {
        count.lactoseFreeMilk = document.getElementById("lactoseFreeMilk").value;
        lactoseFreeMilkSumm = count.lactoseFreeMilk * prices.lactoseFreeMilk;
        chekCalc();
    }
    lactoseFreeMilkButton.addEventListener("click", lactoseFreeMilk);
    function peanut() {
        count.peanut = document.getElementById("peanut").value;
        peanutSumm = count.peanut * prices.peanut;
        chekCalc();
    }
    peanutButton.addEventListener("click", peanut);
    function coconutShavings() {
        count.coconutShavings = document.getElementById("coconutShavings").value;
        coconutShavingsSumm = count.coconutShavings * prices.coconutShavings;
        chekCalc();
    }
    coconutShavingsButton.addEventListener("click", coconutShavings);
    function marshmellow() {
        count.marshmellow = document.getElementById("marshmellow").value;
        marshmellowSumm = count.marshmellow * prices.marshmellow;
        chekCalc();
    }
    marshmellowButton.addEventListener("click", marshmellow);
    function oreoCoffe() {
        count.oreoCoffe = document.getElementById("oreoCoffe").value;
        oreoCoffeSumm = count.oreoCoffe * prices.oreoCoffe;
        chekCalc();
    }
    oreoCoffeButton.addEventListener("click", oreoCoffe);
    function lionCoffe() {
        count.lionCoffe = document.getElementById("lionCoffe").value;
        lionCoffeSumm = count.lionCoffe * prices.lionCoffe;
        chekCalc();
    }
    lionCoffeButton.addEventListener("click", lionCoffe);
    function bananaCoffe() {
        count.bananaCoffe = document.getElementById("bananaCoffe").value;
        bananaCoffeSumm = count.bananaCoffe * prices.bananaCoffe;
        chekCalc();
    }
    bananaCoffeButton.addEventListener("click", bananaCoffe);
    function coconutCoffe() {
        count.coconutCoffe = document.getElementById("coconutCoffe").value;
        coconutCoffeSumm = count.coconutCoffe * prices.coconutCoffe;
        chekCalc();
    }
    coconutCoffeButton.addEventListener("click", coconutCoffe);
    function kendyNutCoffe() {
        count.kendyNutCoffe = document.getElementById("kendyNutCoffe").value;
        kendyNutCoffeSumm = count.kendyNutCoffe * prices.kendyNutCoffe;
        chekCalc();
    }
    kendyNutCoffeButton.addEventListener("click", kendyNutCoffe);
    function mmsCoffe() {
        count.mmsCoffe = document.getElementById("mmsCoffe").value;
        mmsCoffeSumm = count.mmsCoffe * prices.mmsCoffe;
        chekCalc();
    }
    mmsCoffeButton.addEventListener("click", mmsCoffe);
    function cherryCoffe() {
        count.cherryCoffe = document.getElementById("cherryCoffe").value;
        cherryCoffeSumm = count.cherryCoffe * prices.cherryCoffe;
        chekCalc();
    }
    cherryCoffeButton.addEventListener("click", cherryCoffe);
    function glyaseCoffe() {
        count.glyaseCoffe = document.getElementById("glyaseCoffe").value;
        glyaseCoffeSumm = count.glyaseCoffe * prices.glyaseCoffe;
        chekCalc();
    }
    glyaseCoffeButton.addEventListener("click", glyaseCoffe);
    function kakaoRainbowCoffe() {
        count.kakaoRainbowCoffe = document.getElementById("kakaoRainbowCoffe").value;
        kakaoRainbowCoffeSumm = count.kakaoRainbowCoffe * prices.kakaoRainbowCoffe;
        chekCalc();
    }
    kakaoRainbowCoffeButton.addEventListener("click", kakaoRainbowCoffe);
    function coldLatte() {
        count.coldLatte = document.getElementById("coldLatte").value;
        coldLatteSumm = count.coldLatte * prices.coldLatte;
        chekCalc();
    }
    coldLatteButton.addEventListener("click", coldLatte);
    function tigerLatte() {
        count.tigerLatte = document.getElementById("tigerLatte").value;
        tigerLatteSumm = count.tigerLatte * prices.tigerLatte;
        chekCalc();
    }
    tigerLatteButton.addEventListener("click", tigerLatte);
    function fruitMexican() {
        count.fruitMexican = document.getElementById("fruitMexican").value;
        fruitMexicanSumm = count.fruitMexican * prices.fruitMexican;
        chekCalc();
    }
    fruitMexicanButton.addEventListener("click", fruitMexican);
    function tee() {
        count.tee = document.getElementById("tee").value;
        teeSumm = count.tee * prices.tee;
        chekCalc();
    }
    teeButton.addEventListener("click", tee);
    function ekoTee() {
        count.ekoTee = document.getElementById("ekoTee").value;
        ekoTeeSumm = count.ekoTee * prices.ekoTee;
        chekCalc();
    }
    ekoTeeButton.addEventListener("click", ekoTee);
    function chokolate() {
        count.chokolate = document.getElementById("chokolate").value;
        chokolateSumm = count.chokolate * prices.chokolate;
        chekCalc();
    }
    chokolateButton.addEventListener("click", chokolate);
    function chokolatePlus() {
        count.chokolatePlus = document.getElementById("chokolatePlus").value;
        chokolatePlusSumm = count.chokolatePlus * prices.chokolatePlus;
        chekCalc();
    }
    chokolatePlusButton.addEventListener("click", chokolatePlus);
    function mulledWine() {
        count.mulledWine = document.getElementById("mulledWine").value;
        mulledWineSumm = count.mulledWine * prices.mulledWine;
        chekCalc();
    }
    mulledWineButton.addEventListener("click", mulledWine);
    function cacaoNatural() {
        count.cacaoNatural = document.getElementById("cacaoNatural").value;
        cacaoNaturalSumm = count.cacaoNatural * prices.cacaoNatural;
        chekCalc();
    }
    cacaoNaturalButton.addEventListener("click", cacaoNatural);
    function nesquikS() {
        count.nesquikS = document.getElementById("nesquikS").value;
        nesquikSSumm = count.nesquikS * prices.nesquikS;
        chekCalc();
    }
    nesquikSButton.addEventListener("click", nesquikS);
    function nesquikM() {
        count.nesquikM = document.getElementById("nesquikM").value;
        nesquikMSumm = count.nesquikM * prices.nesquikM;
        chekCalc();
    }
    nesquikMButton.addEventListener("click", nesquikM);
    function matcha() {
        count.matcha = document.getElementById("matcha").value;
        matchaSumm = count.matcha * prices.matcha;
        chekCalc();
    }
    matchaButton.addEventListener("click", matcha);
    function matchaLatte() {
        count.matchaLatte = document.getElementById("matchaLatte").value;
        matchaLatteSumm = count.matchaLatte * prices.matchaLatte;
        chekCalc();
    }
    matchaLatteButton.addEventListener("click", matchaLatte);
    function kapucinoSLactoseFree() {
        count.kapucinoSLactoseFree = document.getElementById("kapucinoSLactoseFree").value;
        kapucinoSLactoseFreeSumm = count.kapucinoSLactoseFree * prices.kapucinoSLactoseFree;
        chekCalc();
    }
    kapucinoSLactoseFreeButton.addEventListener("click", kapucinoSLactoseFree);
    function kapucinoMLactoseFree() {
        count.kapucinoMLactoseFree = document.getElementById("kapucinoMLactoseFree").value;
        kapucinoMLactoseFreeSumm = count.kapucinoMLactoseFree * prices.kapucinoMLactoseFree;
        chekCalc();
    }
    kapucinoMLactoseFreeButton.addEventListener("click", kapucinoMLactoseFree);
    function kapucinoLLactoseFree() {
        count.kapucinoLLactoseFree = document.getElementById("kapucinoLLactoseFree").value;
        kapucinoLLactoseFreeSumm = count.kapucinoLLactoseFree * prices.kapucinoLLactoseFree;
        chekCalc();
    }
    kapucinoLLactoseFreeButton.addEventListener("click", kapucinoLLactoseFree);
    function latteSLactoseFree() {
        count.latteSLactoseFree = document.getElementById("latteSLactoseFree").value;
        latteSLactoseFreeSumm = count.latteSLactoseFree * prices.latteSLactoseFree;
        chekCalc();
    }
    latteSLactoseFreeButton.addEventListener("click", latteSLactoseFree);
    function latteMLactoseFree() {
        count.latteMLactoseFree = document.getElementById("latteMLactoseFree").value;
        latteMLactoseFreeSumm = count.latteMLactoseFree * prices.latteMLactoseFree;
        chekCalc();
    }
    latteMLactoseFreeButton.addEventListener("click", latteMLactoseFree);
    function latteLLactoseFree() {
        count.latteLLactoseFree = document.getElementById("latteLLactoseFree").value;
        latteLLactoseFreeSumm = count.latteLLactoseFree * prices.latteLLactoseFree;
        chekCalc();
    }
    latteLLactoseFreeButton.addEventListener("click", latteLLactoseFree);
    function nesquikSLactoseFree() {
        count.nesquikSLactoseFree = document.getElementById("nesquikSLactoseFree").value;
        nesquikSLactoseFreeSumm = count.nesquikSLactoseFree * prices.nesquikSLactoseFree;
        chekCalc();
    }
    nesquikSLactoseFreeButton.addEventListener("click", nesquikSLactoseFree);
    function cacaoNaturalLactoseFree() {
        count.cacaoNaturalLactoseFree = document.getElementById("cacaoNaturalLactoseFree").value;
        cacaoNaturalLactoseFreeSumm = count.cacaoNaturalLactoseFree * prices.cacaoNaturalLactoseFree;
        chekCalc();
    }
    cacaoNaturalLactoseFreeButton.addEventListener("click", cacaoNaturalLactoseFree);
    function fletWhiteSLactoseFree() {
        count.fletWhiteSLactoseFree = document.getElementById("fletWhiteSLactoseFree").value;
        fletWhiteSLactoseFreeSumm = count.fletWhiteSLactoseFree * prices.fletWhiteSLactoseFree;
        chekCalc();
    }
    fletWhiteSLactoseFreeButton.addEventListener("click", fletWhiteSLactoseFree);
    function kapucinoSVegetable() {
        count.kapucinoSVegetable = document.getElementById("kapucinoSVegetable").value;
        kapucinoSVegetableSumm = count.kapucinoSVegetable * prices.kapucinoSVegetable;
        chekCalc();
    }
    kapucinoSVegetableButton.addEventListener("click", kapucinoSVegetable);
    function kapucinoMVegetable() {
        count.kapucinoMVegetable = document.getElementById("kapucinoMVegetable").value;
        kapucinoMVegetableSumm = count.kapucinoMVegetable * prices.kapucinoMVegetable;
        chekCalc();
    }
    kapucinoMVegetableButton.addEventListener("click", kapucinoMVegetable);
    function latteSVegetable() {
        count.latteSVegetable = document.getElementById("latteSVegetable").value;
        latteSVegetableSumm = count.latteSVegetable * prices.latteSVegetable;
        chekCalc();
    }
    latteSVegetableButton.addEventListener("click", latteSVegetable);
    function latteMVegetable() {
        count.latteMVegetable = document.getElementById("latteMVegetable").value;
        latteMVegetableSumm = count.latteMVegetable * prices.latteMVegetable;
        chekCalc();
    }
    latteMVegetableButton.addEventListener("click", latteMVegetable);
    function cacaoNaturalVegetable() {
        count.cacaoNaturalVegetable = document.getElementById("cacaoNaturalVegetable").value;
        cacaoNaturalVegetableSumm = count.cacaoNaturalVegetable * prices.cacaoNaturalVegetable;
        chekCalc();
    }
    cacaoNaturalVegetableButton.addEventListener("click", cacaoNaturalVegetable);
    function fletWhiteSVegetable() {
        count.fletWhiteSVegetable = document.getElementById("fletWhiteSVegetable").value;
        fletWhiteSVegetableSumm = count.fletWhiteSVegetable * prices.fletWhiteSVegetable;
        chekCalc();
    }
    fletWhiteSVegetableButton.addEventListener("click", fletWhiteSVegetable);
    function jarIceCream() {
        count.jarIceCream = document.getElementById("jarIceCream").value;
        jarIceCreamSumm = count.jarIceCream * prices.jarIceCream;
        chekCalc();
    }
    jarIceCreamButton.addEventListener("click", jarIceCream);
    function jarSorbet() {
        count.jarSorbet = document.getElementById("jarSorbet").value;
        jarSorbetSumm = count.jarSorbet * prices.jarSorbet;
        chekCalc();
    }
    jarSorbetButton.addEventListener("click", jarSorbet);
    function iceCream001() {
        count.iceCream001 = document.getElementById("iceCream001").value;
        Number();
        if (1 == count.iceCream001) iceCream001Summ = count.iceCream001 * prices.iceCream001; else if (2 == count.iceCream001) {
            count.iceCream001PCS3 = 0;
            count.iceCream001PCS2 = 1;
            iceCream001Summ = count.iceCream001 * prices.iceCream001 - 2;
        } else if (count.iceCream001 >= 3) {
            count.iceCream001PCS2 = 0;
            count.iceCream001PCS3 = 1;
            iceCream001Summ = count.iceCream001 * prices.iceCream001 - 6;
        } else iceCream001Summ = 0;
        chekCalc();
    }
    iceCream001Button.addEventListener("click", iceCream001);
    function iceCream002() {
        count.iceCream002 = document.getElementById("iceCream002").value;
        if (1 == count.iceCream002) iceCream002Summ = count.iceCream002 * prices.iceCream002; else if (2 == count.iceCream002) {
            count.iceCream002PCS3 = 0;
            count.iceCream002PCS2 = 1;
            iceCream002Summ = count.iceCream002 * prices.iceCream002 - 2;
        } else if (count.iceCream002 >= 3) {
            count.iceCream002PCS2 = 0;
            count.iceCream002PCS3 = 1;
            iceCream002Summ = count.iceCream002 * prices.iceCream002 - 6;
        } else iceCream002Summ = 0;
        chekCalc();
    }
    iceCream002Button.addEventListener("click", iceCream002);
    function sellFoo() {
        chekSumm -= chekSumm / 100 * 20;
        chek.value = chekSumm;
    }
    sell.addEventListener("click", sellFoo);
    let reportCountObject = {
        espresso: Number(0),
        americano: Number(0),
        dopio: Number(0),
        kapucinoS: Number(0),
        kapucinoM: Number(0),
        kapucinoL: Number(0),
        latteS: Number(0),
        latteM: Number(0),
        latteL: Number(0),
        rafS: Number(0),
        rafM: Number(0),
        fletWhiteS: Number(0),
        fletWhiteM: Number(0),
        cream: Number(),
        syrup: Number(),
        milk: Number(),
        vegetableMilk: Number(),
        lactoseFreeMilk: Number(),
        peanut: Number(),
        coconutShavings: Number(),
        marshmellow: Number(),
        oreoCoffe: Number(),
        lionCoffe: Number(),
        bananaCoffe: Number(),
        coconutCoffe: Number(),
        kendyNutCoffe: Number(),
        mmsCoffe: Number(),
        cherryCoffe: Number(),
        glyaseCoffe: Number(),
        kakaoRainbowCoffe: Number(),
        coldLatte: Number(),
        tigerLatte: Number(),
        fruitMexican: Number(),
        tee: Number(),
        ekoTee: Number(),
        chokolate: Number(),
        chokolatePlus: Number(),
        mulledWine: Number(),
        cacaoNatural: Number(),
        nesquikS: Number(),
        nesquikM: Number(),
        matcha: Number(),
        matchaLatte: Number(),
        kapucinoSLactoseFree: Number(),
        kapucinoMLactoseFree: Number(),
        kapucinoLLactoseFree: Number(),
        latteSLactoseFree: Number(),
        latteMLactoseFree: Number(),
        latteLLactoseFree: Number(),
        nesquikSLactoseFree: Number(),
        cacaoNaturalLactoseFree: Number(),
        fletWhiteSLactoseFree: Number(),
        kapucinoSVegetable: Number(),
        kapucinoMVegetable: Number(),
        latteSVegetable: Number(),
        latteMVegetable: Number(),
        cacaoNaturalVegetable: Number(),
        fletWhiteSVegetable: Number(),
        jarIceCream: Number(),
        jarSorbet: Number(),
        iceCream001: Number(),
        iceCream001PCS2: Number(),
        iceCream001PCS3: Number(),
        iceCream002: Number(),
        iceCream002PCS2: Number(),
        iceCream002PCS3: Number()
    };
    function report() {
        summ.allSumm = summ.allSumm + chekSumm;
        allSummValue.value = summ.allSumm;
        clearAll();
    }
    function reportCash() {
        reportSave();
        summ.cashSumm = summ.cashSumm + chekSumm;
        cashSummValue.value = summ.cashSumm;
        auditCounter += 1;
        localStorage.setItem("auditCounter", JSON.stringify(auditCounter));
        report();
    }
    function reportCard() {
        reportSave();
        summ.cardSumm = summ.cardSumm + chekSumm;
        cardSummValue.value = summ.cardSumm;
        auditCounter += 1;
        localStorage.setItem("auditCounter", JSON.stringify(auditCounter));
        clearAll();
    }
    confirmCash.addEventListener("click", reportCash);
    confirmCard.addEventListener("click", reportCard);
    function clearAll() {
        localStorage.setItem("summ", JSON.stringify(summ));
        americanoSumm = count.americano = document.getElementById("americano").value = 0;
        espressoSumm = count.espresso = document.getElementById("espresso").value = 0;
        dopioSumm = count.dopio = document.getElementById("dopio").value = 0;
        kapucinoSSumm = count.kapucinoS = document.getElementById("kapucinoS").value = 0;
        kapucinoMSumm = count.kapucinoM = document.getElementById("kapucinoM").value = 0;
        kapucinoLSumm = count.kapucinoL = document.getElementById("kapucinoL").value = 0;
        latteSSumm = count.latteS = document.getElementById("latteS").value = 0;
        latteMSumm = count.latteM = document.getElementById("latteM").value = 0;
        latteLSumm = count.latteL = document.getElementById("latteL").value = 0;
        rafSSumm = count.rafS = document.getElementById("rafS").value = 0;
        rafMSumm = count.rafM = document.getElementById("rafM").value = 0;
        fletWhiteSSumm = count.fletWhiteS = document.getElementById("fletWhiteS").value = 0;
        fletWhiteMSumm = count.fletWhiteM = document.getElementById("fletWhiteM").value = 0;
        creamSumm = count.cream = document.getElementById("cream").value = 0;
        syrupSumm = count.syrup = document.getElementById("syrup").value = 0;
        milkSumm = count.milk = document.getElementById("milk").value = 0;
        vegetableMilkSumm = count.vegetableMilk = document.getElementById("vegetableMilk").value = 0;
        lactoseFreeMilkSumm = count.lactoseFreeMilk = document.getElementById("lactoseFreeMilk").value = 0;
        peanutSumm = count.peanut = document.getElementById("peanut").value = 0;
        coconutShavingsSumm = count.coconutShavings = document.getElementById("coconutShavings").value = 0;
        marshmellowSumm = count.marshmellow = document.getElementById("marshmellow").value = 0;
        oreoCoffeSumm = count.oreoCoffe = document.getElementById("oreoCoffe").value = 0;
        lionCoffeSumm = count.lionCoffe = document.getElementById("lionCoffe").value = 0;
        bananaCoffeSumm = count.bananaCoffe = document.getElementById("bananaCoffe").value = 0;
        coconutCoffeSumm = count.coconutCoffe = document.getElementById("coconutCoffe").value = 0;
        kendyNutCoffeSumm = count.kendyNutCoffe = document.getElementById("kendyNutCoffe").value = 0;
        mmsCoffeSumm = count.mmsCoffe = document.getElementById("mmsCoffe").value = 0;
        cherryCoffeSumm = count.cherryCoffe = document.getElementById("cherryCoffe").value = 0;
        glyaseCoffeSumm = count.glyaseCoffe = document.getElementById("glyaseCoffe").value = 0;
        kakaoRainbowCoffeSumm = count.kakaoRainbowCoffe = document.getElementById("kakaoRainbowCoffe").value = 0;
        coldLatteSumm = count.coldLatte = document.getElementById("coldLatte").value = 0;
        tigerLatteSumm = count.tigerLatte = document.getElementById("tigerLatte").value = 0;
        fruitMexicanSumm = count.fruitMexican = document.getElementById("fruitMexican").value = 0;
        teeSumm = count.tee = document.getElementById("tee").value = 0;
        ekoTeeSumm = count.ekoTee = document.getElementById("ekoTee").value = 0;
        chokolateSumm = count.chokolate = document.getElementById("chokolate").value = 0;
        chokolatePlusSumm = count.chokolatePlus = document.getElementById("chokolatePlus").value = 0;
        mulledWineSumm = count.mulledWine = document.getElementById("mulledWine").value = 0;
        cacaoNaturalSumm = count.cacaoNatural = document.getElementById("cacaoNatural").value = 0;
        nesquikSSumm = count.nesquikS = document.getElementById("nesquikS").value = 0;
        nesquikMSumm = count.nesquikM = document.getElementById("nesquikM").value = 0;
        matchaSumm = count.matcha = document.getElementById("matcha").value = 0;
        matchaLatteSumm = count.matchaLatte = document.getElementById("matchaLatte").value = 0;
        kapucinoSLactoseFreeSumm = count.kapucinoSLactoseFree = document.getElementById("kapucinoSLactoseFree").value = 0;
        kapucinoMLactoseFreeSumm = count.kapucinoMLactoseFree = document.getElementById("kapucinoMLactoseFree").value = 0;
        kapucinoLLactoseFreeSumm = count.kapucinoLLactoseFree = document.getElementById("kapucinoLLactoseFree").value = 0;
        latteSLactoseFreeSumm = count.latteSLactoseFree = document.getElementById("latteSLactoseFree").value = 0;
        latteMLactoseFreeSumm = count.latteMLactoseFree = document.getElementById("latteMLactoseFree").value = 0;
        latteLLactoseFreeSumm = count.latteLLactoseFree = document.getElementById("latteLLactoseFree").value = 0;
        nesquikSLactoseFreeSumm = count.nesquikSLactoseFree = document.getElementById("nesquikSLactoseFree").value = 0;
        cacaoNaturalLactoseFreeSumm = count.cacaoNaturalLactoseFree = document.getElementById("cacaoNaturalLactoseFree").value = 0;
        fletWhiteSLactoseFreeSumm = count.fletWhiteSLactoseFree = document.getElementById("fletWhiteSLactoseFree").value = 0;
        kapucinoSVegetableSumm = count.kapucinoSVegetable = document.getElementById("kapucinoSVegetable").value = 0;
        kapucinoMVegetableSumm = count.kapucinoMVegetable = document.getElementById("kapucinoMVegetable").value = 0;
        latteSVegetableSumm = count.latteSVegetable = document.getElementById("latteSVegetable").value = 0;
        latteMVegetableSumm = count.latteMVegetable = document.getElementById("latteMVegetable").value = 0;
        cacaoNaturalVegetableSumm = count.cacaoNaturalVegetable = document.getElementById("cacaoNaturalVegetable").value = 0;
        fletWhiteSVegetableSumm = count.fletWhiteSVegetable = document.getElementById("fletWhiteSVegetable").value = 0;
        jarIceCreamSumm = count.jarIceCream = document.getElementById("jarIceCream").value = 0;
        jarSorbetSumm = count.jarSorbet = document.getElementById("jarSorbet").value = 0;
        iceCream001Summ = count.iceCream001 = count.iceCream001PCS2 = count.iceCream001PCS3 = document.getElementById("iceCream001").value = 0;
        iceCream002Summ = count.iceCream002 = count.iceCream002PCS2 = count.iceCream002PCS3 = document.getElementById("iceCream002").value = 0;
        chek.value = chekSumm = 0;
        document.getElementById("beforeMoney").value = "";
    }
    function beforeMoneyFoo() {
        beforeMoneyValue = document.getElementById("beforeMoney").value;
        summ.allSumm = summ.allSumm + +beforeMoneyValue;
        allSummValue.value = summ.allSumm;
        auditCounter += 1;
        localStorage.setItem("auditCounter", JSON.stringify(auditCounter));
        localStorage.setItem("summ", JSON.stringify(summ));
        report();
    }
    beforeMoneyButton.addEventListener("click", beforeMoneyFoo);
    function reportSave() {
        reportSaveCount();
        saveReport();
        reportSaveCountValue();
    }
    function reportSaveCount() {
        reportCountObject = {
            espresso: reportCountObject.espresso + +count.espresso,
            americano: reportCountObject.americano + +count.americano,
            dopio: reportCountObject.dopio + +count.dopio,
            kapucinoS: reportCountObject.kapucinoS + +count.kapucinoS,
            kapucinoM: reportCountObject.kapucinoM + +count.kapucinoM,
            kapucinoL: reportCountObject.kapucinoL + +count.kapucinoL,
            latteS: reportCountObject.latteS + +count.latteS,
            latteM: reportCountObject.latteM + +count.latteM,
            latteL: reportCountObject.latteL + +count.latteL,
            rafS: reportCountObject.rafS + +count.rafS,
            rafM: reportCountObject.rafM + +count.rafM,
            fletWhiteS: reportCountObject.fletWhiteS + +count.fletWhiteS,
            fletWhiteM: reportCountObject.fletWhiteM + +count.fletWhiteM,
            cream: reportCountObject.cream + +count.cream,
            syrup: reportCountObject.syrup + +count.syrup,
            milk: reportCountObject.milk + +count.milk,
            vegetableMilk: reportCountObject.vegetableMilk + +count.vegetableMilk,
            lactoseFreeMilk: reportCountObject.lactoseFreeMilk + +count.lactoseFreeMilk,
            peanut: reportCountObject.peanut + +count.peanut,
            coconutShavings: reportCountObject.coconutShavings + +count.coconutShavings,
            marshmellow: reportCountObject.marshmellow + +count.marshmellow,
            oreoCoffe: reportCountObject.oreoCoffe + +count.oreoCoffe,
            lionCoffe: reportCountObject.lionCoffe + +count.lionCoffe,
            bananaCoffe: reportCountObject.bananaCoffe + +count.bananaCoffe,
            coconutCoffe: reportCountObject.coconutCoffe + +count.coconutCoffe,
            kendyNutCoffe: reportCountObject.kendyNutCoffe + +count.kendyNutCoffe,
            mmsCoffe: reportCountObject.mmsCoffe + +count.mmsCoffe,
            cherryCoffe: reportCountObject.cherryCoffe + +count.cherryCoffe,
            glyaseCoffe: reportCountObject.glyaseCoffe + +count.glyaseCoffe,
            kakaoRainbowCoffe: reportCountObject.kakaoRainbowCoffe + +count.kakaoRainbowCoffe,
            coldLatte: reportCountObject.coldLatte + +count.coldLatte,
            tigerLatte: reportCountObject.tigerLatte + +count.tigerLatte,
            fruitMexican: reportCountObject.fruitMexican + +count.fruitMexican,
            tee: reportCountObject.tee + +count.tee,
            ekoTee: reportCountObject.ekoTee + +count.ekoTee,
            chokolate: reportCountObject.chokolate + +count.chokolate,
            chokolatePlus: reportCountObject.chokolatePlus + +count.chokolatePlus,
            mulledWine: reportCountObject.mulledWine + +count.mulledWine,
            cacaoNatural: reportCountObject.cacaoNatural + +count.cacaoNatural,
            nesquikS: reportCountObject.nesquikS + +count.nesquikS,
            nesquikM: reportCountObject.nesquikM + +count.nesquikM,
            matcha: reportCountObject.matcha + +count.matcha,
            matchaLatte: reportCountObject.matchaLatte + +count.matchaLatte,
            kapucinoSLactoseFree: reportCountObject.kapucinoSLactoseFree + +count.kapucinoSLactoseFree,
            kapucinoMLactoseFree: reportCountObject.kapucinoMLactoseFree + +count.kapucinoMLactoseFree,
            kapucinoLLactoseFree: reportCountObject.kapucinoLLactoseFree + +count.kapucinoLLactoseFree,
            latteSLactoseFree: reportCountObject.latteSLactoseFree + +count.latteSLactoseFree,
            latteMLactoseFree: reportCountObject.latteMLactoseFree + +count.latteMLactoseFree,
            latteLLactoseFree: reportCountObject.latteLLactoseFree + +count.latteLLactoseFree,
            nesquikSLactoseFree: reportCountObject.nesquikSLactoseFree + +count.nesquikSLactoseFree,
            cacaoNaturalLactoseFree: reportCountObject.cacaoNaturalLactoseFree + +count.cacaoNaturalLactoseFree,
            fletWhiteSLactoseFree: reportCountObject.fletWhiteSLactoseFree + +count.fletWhiteSLactoseFree,
            kapucinoSVegetable: reportCountObject.kapucinoSVegetable + +count.kapucinoSVegetable,
            kapucinoMVegetable: reportCountObject.kapucinoMVegetable + +count.kapucinoMVegetable,
            latteSVegetable: reportCountObject.latteSVegetable + +count.latteSVegetable,
            latteMVegetable: reportCountObject.latteMVegetable + +count.latteMVegetable,
            cacaoNaturalVegetable: reportCountObject.cacaoNaturalVegetable + +count.cacaoNaturalVegetable,
            fletWhiteSVegetable: reportCountObject.fletWhiteSVegetable + +count.fletWhiteSVegetable,
            jarIceCream: reportCountObject.jarIceCream + +count.jarIceCream,
            jarSorbet: reportCountObject.jarSorbet + +count.jarSorbet,
            iceCream001: reportCountObject.iceCream001 + +count.iceCream001,
            iceCream001PCS2: reportCountObject.iceCream001PCS2 + +count.iceCream001PCS2,
            iceCream001PCS3: reportCountObject.iceCream001PCS3 + +count.iceCream001PCS3,
            iceCream002: reportCountObject.iceCream002 + +count.iceCream002,
            iceCream002PCS2: reportCountObject.iceCream002PCS2 + +count.iceCream002PCS2,
            iceCream002PCS3: reportCountObject.iceCream002PCS3 + +count.iceCream002PCS3
        };
    }
    function reportSaveCountValue() {
        reportEspressoValue.value = reportCountObject.espresso;
        if (reportEspressoValue.value > 0) {
            let parent = reportEspressoValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportAmericanoValue.value = reportCountObject.americano;
        if (reportAmericanoValue.value > 0) {
            let parent = reportAmericanoValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportDopioValue.value = reportCountObject.dopio;
        if (reportDopioValue.value > 0) {
            let parent = reportDopioValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoSValue.value = reportCountObject.kapucinoS;
        if (reportKapucinoSValue.value > 0) {
            let parent = reportKapucinoSValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoMValue.value = reportCountObject.kapucinoM;
        if (reportKapucinoMValue.value > 0) {
            let parent = reportKapucinoMValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoLValue.value = reportCountObject.kapucinoL;
        if (reportKapucinoLValue.value > 0) {
            let parent = reportKapucinoLValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteSValue.value = reportCountObject.latteS;
        if (reportLatteSValue.value > 0) {
            let parent = reportLatteSValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteMValue.value = reportCountObject.latteM;
        if (reportLatteMValue.value > 0) {
            let parent = reportLatteMValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteLValue.value = reportCountObject.latteL;
        if (reportLatteLValue.value > 0) {
            let parent = reportLatteLValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportRafSValue.value = reportCountObject.rafS;
        if (reportRafSValue.value > 0) {
            let parent = reportRafSValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportRafMValue.value = reportCountObject.rafM;
        if (reportRafMValue.value > 0) {
            let parent = reportRafMValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportFletWhiteSValue.value = reportCountObject.fletWhiteS;
        if (reportFletWhiteSValue.value > 0) {
            let parent = reportFletWhiteSValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportFletWhiteMValue.value = reportCountObject.fletWhiteM;
        if (reportFletWhiteMValue.value > 0) {
            var parent = reportFletWhiteMValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCreamValue.value = reportCountObject.cream;
        if (reportCreamValue.value > 0) {
            parent = reportCreamValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportSyrupValue.value = reportCountObject.syrup;
        if (reportSyrupValue.value > 0) {
            parent = reportSyrupValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportMilkValue.value = reportCountObject.milk;
        if (reportMilkValue.value > 0) {
            parent = reportMilkValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportVegetableMilkValue.value = reportCountObject.vegetableMilk;
        if (reportVegetableMilkValue.value > 0) {
            parent = reportVegetableMilkValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLactoseFreeMilkValue.value = reportCountObject.lactoseFreeMilk;
        if (reportLactoseFreeMilkValue.value > 0) {
            parent = reportLactoseFreeMilkValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportPeanutValue.value = reportCountObject.peanut;
        if (reportPeanutValue.value > 0) {
            parent = reportPeanutValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCoconutShavingsValue.value = reportCountObject.coconutShavings;
        if (reportCoconutShavingsValue.value > 0) {
            parent = reportCoconutShavingsValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportMarshmellowValue.value = reportCountObject.marshmellow;
        if (reportMarshmellowValue.value > 0) {
            parent = reportMarshmellowValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportOreoCoffeValue.value = reportCountObject.oreoCoffe;
        if (reportOreoCoffeValue.value > 0) {
            parent = reportOreoCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLionCoffeValue.value = reportCountObject.lionCoffe;
        if (reportLionCoffeValue.value > 0) {
            parent = reportLionCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportBananaCoffeValue.value = reportCountObject.bananaCoffe;
        if (reportBananaCoffeValue.value > 0) {
            parent = reportBananaCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCoconutCoffeValue.value = reportCountObject.coconutCoffe;
        if (reportCoconutCoffeValue.value > 0) {
            parent = reportCoconutCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKendyNutCoffeValue.value = reportCountObject.kendyNutCoffe;
        if (reportKendyNutCoffeValue.value > 0) {
            parent = reportKendyNutCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportMmsCoffeValue.value = reportCountObject.mmsCoffe;
        if (reportMmsCoffeValue.value > 0) {
            parent = reportMmsCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCherryCoffeValue.value = reportCountObject.cherryCoffe;
        if (reportCherryCoffeValue.value > 0) {
            parent = reportCherryCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportGlyaseCoffeValue.value = reportCountObject.glyaseCoffe;
        if (reportGlyaseCoffeValue.value > 0) {
            parent = reportGlyaseCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKakaoRainbowCoffeValue.value = reportCountObject.kakaoRainbowCoffe;
        if (reportKakaoRainbowCoffeValue.value > 0) {
            parent = reportKakaoRainbowCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportColdLatteValue.value = reportCountObject.coldLatte;
        if (reportColdLatteValue.value > 0) {
            parent = reportColdLatteValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportTigerLatteValue.value = reportCountObject.tigerLatte;
        if (reportTigerLatteValue.value > 0) {
            parent = reportTigerLatteValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportFruitMexicanValue.value = reportCountObject.fruitMexican;
        if (reportFruitMexicanValue.value > 0) {
            parent = reportFruitMexicanValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportTeeValue.value = reportCountObject.tee;
        if (reportTeeValue.value > 0) {
            parent = reportTeeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportEkoTeeValue.value = reportCountObject.ekoTee;
        if (reportEkoTeeValue.value > 0) {
            parent = reportEkoTeeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportChokolateValue.value = reportCountObject.chokolate;
        if (reportChokolateValue.value > 0) {
            parent = reportChokolateValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportChokolatePlusValue.value = reportCountObject.chokolatePlus;
        if (reportChokolatePlusValue.value > 0) {
            parent = reportChokolatePlusValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportMulledWineValue.value = reportCountObject.mulledWine;
        if (reportMulledWineValue.value > 0) {
            parent = reportMulledWineValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCacaoNaturalValue.value = reportCountObject.cacaoNatural;
        if (reportCacaoNaturalValue.value > 0) {
            parent = reportCacaoNaturalValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportNesquikSValue.value = reportCountObject.nesquikS;
        if (reportNesquikSValue.value > 0) {
            parent = reportNesquikSValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportNesquikMValue.value = reportCountObject.nesquikM;
        if (reportNesquikMValue.value > 0) {
            parent = reportNesquikMValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportMatchaValue.value = reportCountObject.matcha;
        if (reportMatchaValue.value > 0) {
            parent = reportMatchaValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportMatchaLatteValue.value = reportCountObject.matchaLatte;
        if (reportMatchaLatteValue.value > 0) {
            parent = reportMatchaLatteValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoSLactoseFreeValue.value = reportCountObject.kapucinoSLactoseFree;
        if (reportKapucinoSLactoseFreeValue.value > 0) {
            parent = reportKapucinoSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoMLactoseFreeValue.value = reportCountObject.kapucinoMLactoseFree;
        if (reportKapucinoMLactoseFreeValue.value > 0) {
            parent = reportKapucinoMLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoLLactoseFreeValue.value = reportCountObject.kapucinoLLactoseFree;
        if (reportKapucinoLLactoseFreeValue.value > 0) {
            parent = reportKapucinoLLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteSLactoseFreeValue.value = reportCountObject.latteSLactoseFree;
        if (reportLatteSLactoseFreeValue.value > 0) {
            parent = reportLatteSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteMLactoseFreeValue.value = reportCountObject.latteMLactoseFree;
        if (reportLatteMLactoseFreeValue.value > 0) {
            parent = reportLatteMLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteLLactoseFreeValue.value = reportCountObject.latteLLactoseFree;
        if (reportLatteLLactoseFreeValue.value > 0) {
            parent = reportLatteLLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportNesquikSLactoseFreeValue.value = reportCountObject.nesquikSLactoseFree;
        if (reportNesquikSLactoseFreeValue.value > 0) {
            parent = reportNesquikSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCacaoNaturalLactoseFreeValue.value = reportCountObject.cacaoNaturalLactoseFree;
        if (reportCacaoNaturalLactoseFreeValue.value > 0) {
            parent = reportCacaoNaturalLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportFletWhiteSLactoseFreeValue.value = reportCountObject.fletWhiteSLactoseFree;
        if (reportFletWhiteSLactoseFreeValue.value > 0) {
            parent = reportFletWhiteSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoSVegetableValue.value = reportCountObject.kapucinoSVegetable;
        if (reportKapucinoSVegetableValue.value > 0) {
            parent = reportKapucinoSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportKapucinoMVegetableValue.value = reportCountObject.kapucinoMVegetable;
        if (reportKapucinoMVegetableValue.value > 0) {
            parent = reportKapucinoMVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteSVegetableValue.value = reportCountObject.latteSVegetable;
        if (reportLatteSVegetableValue.value > 0) {
            parent = reportLatteSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportLatteMVegetableValue.value = reportCountObject.latteMVegetable;
        if (reportLatteMVegetableValue.value > 0) {
            parent = reportLatteMVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportCacaoNaturalVegetableValue.value = reportCountObject.cacaoNaturalVegetable;
        if (reportCacaoNaturalVegetableValue.value > 0) {
            parent = reportCacaoNaturalVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportFletWhiteSVegetableValue.value = reportCountObject.fletWhiteSVegetable;
        if (reportFletWhiteSVegetableValue.value > 0) {
            parent = reportFletWhiteSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportJarIceCreamValue.value = reportCountObject.jarIceCream;
        if (reportJarIceCreamValue.value > 0) {
            parent = reportJarIceCreamValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportJarSorbetValue.value = reportCountObject.jarSorbet;
        if (reportJarSorbetValue.value > 0) {
            parent = reportJarSorbetValue.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportIceCream001Value.value = reportCountObject.iceCream001;
        if (reportIceCream001Value.value > 0) {
            parent = reportIceCream001Value.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportIceCream001PCS2Value.value = reportCountObject.iceCream001PCS2;
        if (reportIceCream001PCS2Value.value > 0) {
            parent = reportIceCream001PCS2Value.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportIceCream001PCS3Value.value = reportCountObject.iceCream001PCS3;
        if (reportIceCream001PCS3Value.value > 0) {
            parent = reportIceCream001PCS3Value.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportIceCream002Value.value = reportCountObject.iceCream002;
        if (reportIceCream002Value.value > 0) {
            parent = reportIceCream002Value.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportIceCream002PCS2Value.value = reportCountObject.iceCream002PCS2;
        if (reportIceCream002PCS2Value.value > 0) {
            parent = reportIceCream002PCS2Value.closest(".all-report__item");
            parent.classList.add("active");
        }
        reportIceCream002PCS3Value.value = reportCountObject.iceCream002PCS3;
        if (reportIceCream002PCS3Value.value > 0) {
            parent = reportIceCream002PCS3Value.closest(".all-report__item");
            parent.classList.add("active");
        }
    }
    var auditCounter = Number(0);
    window.onload = reloadSave;
    function reloadSave() {
        if ((auditCounter = JSON.parse(localStorage.getItem("auditCounter"))) > 0) {
            reportCountObject = JSON.parse(localStorage.getItem("object"));
            summ = JSON.parse(localStorage.getItem("summ"));
            allSummValue.value = summ.allSumm;
            cashSummValue.value = summ.cashSumm;
            cardSummValue.value = summ.cardSumm;
            reportSaveCountValue();
        }
    }
    function saveReport() {
        localStorage.setItem("object", JSON.stringify(reportCountObject));
    }
    var buttonCloseDay = document.getElementById("closeDay");
    function closeDay() {
        reportCountObject = {
            espresso: 0,
            americano: 0,
            dopio: 0,
            kapucinoS: 0,
            kapucinoM: 0,
            kapucinoL: 0,
            latteS: 0,
            latteM: 0,
            latteL: 0,
            rafS: 0,
            rafM: 0,
            fletWhiteS: 0,
            fletWhiteM: 0,
            cream: 0,
            syrup: 0,
            milk: 0,
            vegetableMilk: 0,
            lactoseFreeMilk: 0,
            peanut: 0,
            coconutShavings: 0,
            marshmellow: 0,
            oreoCoffe: 0,
            lionCoffe: 0,
            bananaCoffe: 0,
            coconutCoffe: 0,
            kendyNutCoffe: 0,
            mmsCoffe: 0,
            cherryCoffe: 0,
            glyaseCoffe: 0,
            kakaoRainbowCoffe: 0,
            coldLatte: 0,
            tigerLatte: 0,
            fruitMexican: 0,
            tee: 0,
            ekoTee: 0,
            chokolate: 0,
            chokolatePlus: 0,
            mulledWine: 0,
            cacaoNatural: 0,
            nesquikS: 0,
            nesquikM: 0,
            matcha: 0,
            matchaLatte: 0,
            kapucinoSLactoseFree: 0,
            kapucinoMLactoseFree: 0,
            kapucinoLLactoseFree: 0,
            latteSLactoseFree: 0,
            latteMLactoseFree: 0,
            latteLLactoseFree: 0,
            nesquikSLactoseFree: 0,
            cacaoNaturalLactoseFree: 0,
            fletWhiteSLactoseFree: 0,
            kapucinoSVegetable: 0,
            kapucinoMVegetable: 0,
            latteSVegetable: 0,
            latteMVegetable: 0,
            cacaoNaturalVegetable: 0,
            fletWhiteSVegetable: 0,
            jarIceCream: 0,
            jarSorbet: 0,
            iceCream001: 0,
            iceCream002: 0
        };
        summ = {
            allSumm: 0,
            cashSumm: 0,
            cardSumm: 0
        };
        allSummValue.value = summ.allSumm;
        cashSummValue.value = summ.cashSumm;
        cardSummValue.value = summ.cardSumm;
        reportSaveCountValue();
        localStorage.removeItem("object");
        localStorage.removeItem("summ");
        localStorage.removeItem("auditCounter");
        auditCounter = 0;
        setTimeout((function() {
            location.reload();
        }), 50);
    }
    buttonCloseDay.addEventListener("click", closeDay);
    window["FLS"] = true;
    isWebp();
    formQuantity();
})();