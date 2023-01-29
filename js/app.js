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
        iceCream002: 30,
        iceCream003: 30,
        iceCream004: 30,
        waffle001: 32,
        waffle002: 45,
        waffle003: 48,
        waffle004: 48,
        waffle005: 57,
        waffle006: 57,
        waffle007: 75,
        waffle008: 83,
        waffle009: 73,
        waffle0091: 78,
        waffle010: 73,
        waffle0101: 78,
        waffle011: 48,
        waffle012: 48,
        waffle013: 63,
        waffle014: 78,
        waffle015: 69
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
        iceCream002PCS3: Number(),
        iceCream003: Number(),
        iceCream003PCS2: Number(),
        iceCream003PCS3: Number(),
        iceCream004: Number(),
        iceCream004PCS2: Number(),
        iceCream004PCS3: Number(),
        waffle001: Number(),
        waffle002: Number(),
        waffle003: Number(),
        waffle004: Number(),
        waffle005: Number(),
        waffle006: Number(),
        waffle007: Number(),
        waffle008: Number(),
        waffle009: Number(),
        waffle0091: Number(),
        waffle010: Number(),
        waffle0101: Number(),
        waffle011: Number(),
        waffle012: Number(),
        waffle013: Number(),
        waffle014: Number(),
        waffle015: Number()
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
    var iceCream003Summ = Number();
    var iceCream004Summ = Number();
    var waffle001Summ = Number();
    var waffle002Summ = Number();
    var waffle003Summ = Number();
    var waffle004Summ = Number();
    var waffle005Summ = Number();
    var waffle006Summ = Number();
    var waffle007Summ = Number();
    var waffle008Summ = Number();
    var waffle009Summ = Number();
    var waffle0091Summ = Number();
    var waffle010Summ = Number();
    var waffle0101Summ = Number();
    var waffle011Summ = Number();
    var waffle012Summ = Number();
    var waffle013Summ = Number();
    var waffle014Summ = Number();
    var waffle015Summ = Number();
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
    var reportIceCream003Value = document.getElementById("reportIceCream003");
    var reportIceCream003PCS2Value = document.getElementById("reportIceCream003PCS2");
    var reportIceCream003PCS3Value = document.getElementById("reportIceCream003PCS3");
    var reportIceCream004Value = document.getElementById("reportIceCream004");
    var reportIceCream004PCS2Value = document.getElementById("reportIceCream004PCS2");
    var reportIceCream004PCS3Value = document.getElementById("reportIceCream004PCS3");
    var reportWaffle001Value = document.getElementById("reportWaffle001");
    var reportWaffle002Value = document.getElementById("reportWaffle002");
    var reportWaffle003Value = document.getElementById("reportWaffle003");
    var reportWaffle004Value = document.getElementById("reportWaffle004");
    var reportWaffle005Value = document.getElementById("reportWaffle005");
    var reportWaffle006Value = document.getElementById("reportWaffle006");
    var reportWaffle007Value = document.getElementById("reportWaffle007");
    var reportWaffle008Value = document.getElementById("reportWaffle008");
    var reportWaffle009Value = document.getElementById("reportWaffle009");
    var reportWaffle0091Value = document.getElementById("reportWaffle0091");
    var reportWaffle010Value = document.getElementById("reportWaffle010");
    var reportWaffle0101Value = document.getElementById("reportWaffle0101");
    var reportWaffle011Value = document.getElementById("reportWaffle011");
    var reportWaffle012Value = document.getElementById("reportWaffle012");
    var reportWaffle013Value = document.getElementById("reportWaffle013");
    var reportWaffle014Value = document.getElementById("reportWaffle014");
    var reportWaffle015Value = document.getElementById("reportWaffle015");
    const sell = document.getElementById("sell");
    let reportSellCount = {
        espressoValue: document.getElementById("reportEspressoSell"),
        americanoValue: document.getElementById("reportAmericanoSell"),
        dopioValue: document.getElementById("reportDopioSell"),
        kapucinoSValue: document.getElementById("reportKapucinoSSell"),
        kapucinoMValue: document.getElementById("reportKapucinoMSell"),
        kapucinoLValue: document.getElementById("reportKapucinoLSell"),
        latteSValue: document.getElementById("reportLatteSSell"),
        latteMValue: document.getElementById("reportLatteMSell"),
        latteLValue: document.getElementById("reportLatteLSell"),
        rafSValue: document.getElementById("reportRafSSell"),
        rafMValue: document.getElementById("reportRafMSell"),
        fletWhiteSValue: document.getElementById("reportFletWhiteSSell"),
        fletWhiteMValue: document.getElementById("reportFletWhiteMSell"),
        creamValue: document.getElementById("reportCreamSell"),
        syrupValue: document.getElementById("reportSyrupSell"),
        milkValue: document.getElementById("reportMilkSell"),
        vegetableMilkValue: document.getElementById("reportVegetableMilkSell"),
        lactoseFreeMilkValue: document.getElementById("reportLactoseFreeMilkSell"),
        peanutValue: document.getElementById("reportPeanutSell"),
        coconutShavingsValue: document.getElementById("reportCoconutShavingsSell"),
        marshmellowValue: document.getElementById("reportMarshmellowSell"),
        oreoCoffeValue: document.getElementById("reportOreoCoffeSell"),
        lionCoffeValue: document.getElementById("reportLionCoffeSell"),
        bananaCoffeValue: document.getElementById("reportBananaCoffeSell"),
        coconutCoffeValue: document.getElementById("reportCoconutCoffeSell"),
        kendyNutCoffeValue: document.getElementById("reportKendyNutCoffeSell"),
        mmsCoffeValue: document.getElementById("reportMmsCoffeSell"),
        cherryCoffeValue: document.getElementById("reportCherryCoffeSell"),
        glyaseCoffeValue: document.getElementById("reportGlyaseCoffeSell"),
        kakaoRainbowCoffeValue: document.getElementById("reportKakaoRainbowCoffeSell"),
        coldLatteValue: document.getElementById("reportColdLatteSell"),
        tigerLatteValue: document.getElementById("reportTigerLatteSell"),
        fruitMexicanValue: document.getElementById("reportFruitMexicanSell"),
        teeValue: document.getElementById("reportTeeSell"),
        ekoTeeValue: document.getElementById("reportEkoTeeSell"),
        chokolateValue: document.getElementById("reportChokolateSell"),
        chokolatePlusValue: document.getElementById("reportChokolatePlusSell"),
        mulledWineValue: document.getElementById("reportMulledWineSell"),
        cacaoNaturalValue: document.getElementById("reportCacaoNaturalSell"),
        nesquikSValue: document.getElementById("reportNesquikSSell"),
        nesquikMValue: document.getElementById("reportNesquikMSell"),
        matchaValue: document.getElementById("reportMatchaSell"),
        matchaLatteValue: document.getElementById("reportMatchaLatteSell"),
        kapucinoSLactoseFreeValue: document.getElementById("reportKapucinoSLactoseFreeSell"),
        kapucinoMLactoseFreeValue: document.getElementById("reportKapucinoMLactoseFreeSell"),
        kapucinoLLactoseFreeValue: document.getElementById("reportKapucinoLLactoseFreeSell"),
        latteSLactoseFreeValue: document.getElementById("reportLatteSLactoseFreeSell"),
        latteMLactoseFreeValue: document.getElementById("reportLatteMLactoseFreeSell"),
        latteLLactoseFreeValue: document.getElementById("reportLatteLLactoseFreeSell"),
        nesquikSLactoseFreeValue: document.getElementById("reportNesquikSLactoseFreeSell"),
        cacaoNaturalLactoseFreeValue: document.getElementById("reportCacaoNaturalLactoseFreeSell"),
        fletWhiteSLactoseFreeValue: document.getElementById("reportFletWhiteSLactoseFreeSell"),
        kapucinoSVegetableValue: document.getElementById("reportKapucinoSVegetableSell"),
        kapucinoMVegetableValue: document.getElementById("reportKapucinoMVegetableSell"),
        latteSVegetableValue: document.getElementById("reportLatteSVegetableSell"),
        latteMVegetableValue: document.getElementById("reportLatteMVegetableSell"),
        cacaoNaturalVegetableValue: document.getElementById("reportCacaoNaturalVegetableSell"),
        fletWhiteSVegetableValue: document.getElementById("reportFletWhiteSVegetableSell"),
        jarIceCreamValue: document.getElementById("reportJarIceCreamSell"),
        jarSorbetValue: document.getElementById("reportJarSorbetSell"),
        iceCream001Value: document.getElementById("reportIceCream001Sell"),
        iceCream001ValuePCS2: document.getElementById("reportIceCream001PCS2Sell"),
        iceCream001ValuePCS3: document.getElementById("reportIceCream001PCS3Sell"),
        iceCream002Value: document.getElementById("reportIceCream002Sell"),
        iceCream002ValuePCS2: document.getElementById("reportIceCream002PCS2Sell"),
        iceCream002ValuePCS3: document.getElementById("reportIceCream002PCS3Sell"),
        iceCream003Value: document.getElementById("reportIceCream003Sell"),
        iceCream003ValuePCS2: document.getElementById("reportIceCream003PCS2Sell"),
        iceCream003ValuePCS3: document.getElementById("reportIceCream003PCS3Sell"),
        iceCream004Value: document.getElementById("reportIceCream004Sell"),
        iceCream004ValuePCS2: document.getElementById("reportIceCream004PCS2Sell"),
        iceCream004ValuePCS3: document.getElementById("reportIceCream004PCS3Sell"),
        waffle001Value: document.getElementById("reportWaffle001Sell"),
        waffle002Value: document.getElementById("reportWaffle002Sell"),
        waffle003Value: document.getElementById("reportWaffle003Sell"),
        waffle004Value: document.getElementById("reportWaffle004Sell"),
        waffle005Value: document.getElementById("reportWaffle005Sell"),
        waffle006Value: document.getElementById("reportWaffle006Sell"),
        waffle007Value: document.getElementById("reportWaffle007Sell"),
        waffle008Value: document.getElementById("reportWaffle008Sell"),
        waffle009Value: document.getElementById("reportWaffle009Sell"),
        waffle0091Value: document.getElementById("reportWaffle0091Sell"),
        waffle010Value: document.getElementById("reportWaffle010Sell"),
        waffle0101Value: document.getElementById("reportWaffle0101Sell"),
        waffle011Value: document.getElementById("reportWaffle011Sell"),
        waffle012Value: document.getElementById("reportWaffle012Sell"),
        waffle013Value: document.getElementById("reportWaffle013Sell"),
        waffle014Value: document.getElementById("reportWaffle014Sell"),
        waffle015Value: document.getElementById("reportWaffle015Sell")
    };
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
    const iceCream003Button = document.getElementById("iceCream003Button");
    const iceCream004Button = document.getElementById("iceCream004Button");
    const waffle001Button = document.getElementById("waffle001Button");
    const waffle002Button = document.getElementById("waffle002Button");
    const waffle003Button = document.getElementById("waffle003Button");
    const waffle004Button = document.getElementById("waffle004Button");
    const waffle005Button = document.getElementById("waffle005Button");
    const waffle006Button = document.getElementById("waffle006Button");
    const waffle007Button = document.getElementById("waffle007Button");
    const waffle008Button = document.getElementById("waffle008Button");
    const waffle009Button = document.getElementById("waffle009Button");
    const waffle0091Button = document.getElementById("waffle0091Button");
    const waffle010Button = document.getElementById("waffle010Button");
    const waffle0101Button = document.getElementById("waffle0101Button");
    const waffle011Button = document.getElementById("waffle011Button");
    const waffle012Button = document.getElementById("waffle012Button");
    const waffle013Button = document.getElementById("waffle013Button");
    const waffle014Button = document.getElementById("waffle014Button");
    const waffle015Button = document.getElementById("waffle015Button");
    function chekCalc() {
        chekSumm = 0;
        chekSumm = espressoSumm + americanoSumm + dopioSumm + kapucinoSSumm + kapucinoMSumm + kapucinoLSumm + latteSSumm + latteMSumm + latteLSumm + rafSSumm + rafMSumm + fletWhiteSSumm + fletWhiteMSumm + peanutSumm + coconutShavingsSumm + marshmellowSumm + creamSumm + syrupSumm + milkSumm + vegetableMilkSumm + lactoseFreeMilkSumm + oreoCoffeSumm + lionCoffeSumm + bananaCoffeSumm + coconutCoffeSumm + kendyNutCoffeSumm + mmsCoffeSumm + cherryCoffeSumm + glyaseCoffeSumm + kakaoRainbowCoffeSumm + coldLatteSumm + tigerLatteSumm + fruitMexicanSumm + teeSumm + ekoTeeSumm + chokolateSumm + chokolatePlusSumm + mulledWineSumm + cacaoNaturalSumm + nesquikSSumm + nesquikMSumm + matchaSumm + matchaLatteSumm + kapucinoSLactoseFreeSumm + kapucinoMLactoseFreeSumm + kapucinoLLactoseFreeSumm + latteSLactoseFreeSumm + latteMLactoseFreeSumm + latteLLactoseFreeSumm + nesquikSLactoseFreeSumm + cacaoNaturalLactoseFreeSumm + fletWhiteSLactoseFreeSumm + kapucinoSVegetableSumm + kapucinoMVegetableSumm + latteSVegetableSumm + latteMVegetableSumm + cacaoNaturalVegetableSumm + fletWhiteSVegetableSumm + jarIceCreamSumm + jarSorbetSumm + iceCream001Summ + iceCream002Summ + iceCream003Summ + iceCream004Summ + waffle001Summ + waffle002Summ + waffle003Summ + waffle004Summ + waffle005Summ + waffle006Summ + waffle007Summ + waffle008Summ + waffle009Summ + waffle0091Summ + waffle010Summ + waffle0101Summ + waffle011Summ + waffle012Summ + waffle013Summ + waffle014Summ + waffle015Summ;
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
    function iceCream003() {
        count.iceCream003 = document.getElementById("iceCream003").value;
        if (1 == count.iceCream003) iceCream003Summ = count.iceCream003 * prices.iceCream003; else if (2 == count.iceCream003) {
            count.iceCream003PCS3 = 0;
            count.iceCream003PCS2 = 1;
            iceCream003Summ = count.iceCream003 * prices.iceCream003 - 2;
        } else if (count.iceCream003 >= 3) {
            count.iceCream003PCS2 = 0;
            count.iceCream003PCS3 = 1;
            iceCream003Summ = count.iceCream003 * prices.iceCream003 - 6;
        } else iceCream003Summ = 0;
        chekCalc();
    }
    iceCream003Button.addEventListener("click", iceCream003);
    function iceCream004() {
        count.iceCream004 = document.getElementById("iceCream004").value;
        if (1 == count.iceCream004) iceCream004Summ = count.iceCream004 * prices.iceCream004; else if (2 == count.iceCream004) {
            count.iceCream004PCS3 = 0;
            count.iceCream004PCS2 = 1;
            iceCream004Summ = count.iceCream004 * prices.iceCream004 - 2;
        } else if (count.iceCream004 >= 3) {
            count.iceCream004PCS2 = 0;
            count.iceCream004PCS3 = 1;
            iceCream004Summ = count.iceCream004 * prices.iceCream004 - 6;
        } else iceCream004Summ = 0;
        chekCalc();
    }
    iceCream004Button.addEventListener("click", iceCream004);
    function waffle001() {
        count.waffle001 = document.getElementById("waffle001").value;
        waffle001Summ = count.waffle001 * prices.waffle001;
        chekCalc();
    }
    waffle001Button.addEventListener("click", waffle001);
    function waffle002() {
        count.waffle002 = document.getElementById("waffle002").value;
        waffle002Summ = count.waffle002 * prices.waffle002;
        chekCalc();
    }
    waffle002Button.addEventListener("click", waffle002);
    function waffle003() {
        count.waffle003 = document.getElementById("waffle003").value;
        waffle003Summ = count.waffle003 * prices.waffle003;
        chekCalc();
    }
    waffle003Button.addEventListener("click", waffle003);
    function waffle004() {
        count.waffle004 = document.getElementById("waffle004").value;
        waffle004Summ = count.waffle004 * prices.waffle004;
        chekCalc();
    }
    waffle004Button.addEventListener("click", waffle004);
    function waffle005() {
        count.waffle005 = document.getElementById("waffle005").value;
        waffle005Summ = count.waffle005 * prices.waffle005;
        chekCalc();
    }
    waffle005Button.addEventListener("click", waffle005);
    function waffle006() {
        count.waffle006 = document.getElementById("waffle006").value;
        waffle006Summ = count.waffle006 * prices.waffle006;
        chekCalc();
    }
    waffle006Button.addEventListener("click", waffle006);
    function waffle007() {
        count.waffle007 = document.getElementById("waffle007").value;
        waffle007Summ = count.waffle007 * prices.waffle007;
        chekCalc();
    }
    waffle007Button.addEventListener("click", waffle007);
    function waffle008() {
        count.waffle008 = document.getElementById("waffle008").value;
        waffle008Summ = count.waffle008 * prices.waffle008;
        chekCalc();
    }
    waffle008Button.addEventListener("click", waffle008);
    function waffle009() {
        count.waffle009 = document.getElementById("waffle009").value;
        waffle009Summ = count.waffle009 * prices.waffle009;
        chekCalc();
    }
    waffle009Button.addEventListener("click", waffle009);
    function waffle0091() {
        count.waffle0091 = document.getElementById("waffle0091").value;
        waffle0091Summ = count.waffle0091 * prices.waffle0091;
        chekCalc();
    }
    waffle0091Button.addEventListener("click", waffle0091);
    function waffle010() {
        count.waffle010 = document.getElementById("waffle010").value;
        waffle010Summ = count.waffle010 * prices.waffle010;
        chekCalc();
    }
    waffle010Button.addEventListener("click", waffle010);
    function waffle0101() {
        count.waffle0101 = document.getElementById("waffle0101").value;
        waffle0101Summ = count.waffle0101 * prices.waffle0101;
        chekCalc();
    }
    waffle0101Button.addEventListener("click", waffle0101);
    function waffle011() {
        count.waffle011 = document.getElementById("waffle011").value;
        waffle011Summ = count.waffle011 * prices.waffle011;
        chekCalc();
    }
    waffle011Button.addEventListener("click", waffle011);
    function waffle012() {
        count.waffle012 = document.getElementById("waffle012").value;
        waffle012Summ = count.waffle012 * prices.waffle012;
        chekCalc();
    }
    waffle012Button.addEventListener("click", waffle012);
    function waffle013() {
        count.waffle013 = document.getElementById("waffle013").value;
        waffle013Summ = count.waffle013 * prices.waffle013;
        chekCalc();
    }
    waffle013Button.addEventListener("click", waffle013);
    function waffle014() {
        count.waffle014 = document.getElementById("waffle014").value;
        waffle014Summ = count.waffle014 * prices.waffle014;
        chekCalc();
    }
    waffle014Button.addEventListener("click", waffle014);
    function waffle015() {
        count.waffle015 = document.getElementById("waffle015").value;
        waffle015Summ = count.waffle015 * prices.waffle015;
        chekCalc();
    }
    waffle015Button.addEventListener("click", waffle015);
    var sellCount = Number();
    function sellFoo() {
        chekSumm -= chekSumm / 100 * 20;
        chek.value = chekSumm;
        sellCount = 1;
    }
    sell.addEventListener("click", sellFoo);
    let reportCountObject = {
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
        iceCream002PCS3: Number(),
        iceCream003: Number(),
        iceCream003PCS2: Number(),
        iceCream003PCS3: Number(),
        iceCream004: Number(),
        iceCream004PCS2: Number(),
        iceCream004PCS3: Number(),
        waffle001: Number(),
        waffle002: Number(),
        waffle003: Number(),
        waffle004: Number(),
        waffle005: Number(),
        waffle006: Number(),
        waffle007: Number(),
        waffle008: Number(),
        waffle009: Number(),
        waffle0091: Number(),
        waffle010: Number(),
        waffle0101: Number(),
        waffle011: Number(),
        waffle012: Number(),
        waffle013: Number(),
        waffle014: Number(),
        waffle015: Number(),
        espressoSell: Number(),
        americanoSell: Number(),
        dopioSell: Number(),
        kapucinoSSell: Number(),
        kapucinoMSell: Number(),
        kapucinoLSell: Number(),
        latteSSell: Number(),
        latteMSell: Number(),
        latteLSell: Number(),
        rafSSell: Number(),
        rafMSell: Number(),
        fletWhiteSSell: Number(),
        fletWhiteMSell: Number(),
        creamSell: Number(),
        syrupSell: Number(),
        milkSell: Number(),
        vegetableMilkSell: Number(),
        lactoseFreeMilkSell: Number(),
        peanutSell: Number(),
        coconutShavingsSell: Number(),
        marshmellowSell: Number(),
        oreoCoffeSell: Number(),
        lionCoffeSell: Number(),
        bananaCoffeSell: Number(),
        coconutCoffeSell: Number(),
        kendyNutCoffeSell: Number(),
        mmsCoffeSell: Number(),
        cherryCoffeSell: Number(),
        glyaseCoffeSell: Number(),
        kakaoRainbowCoffeSell: Number(),
        coldLatteSell: Number(),
        tigerLatteSell: Number(),
        fruitMexicanSell: Number(),
        teeSell: Number(),
        ekoTeeSell: Number(),
        chokolateSell: Number(),
        chokolatePlusSell: Number(),
        mulledWineSell: Number(),
        cacaoNaturalSell: Number(),
        nesquikSSell: Number(),
        nesquikMSell: Number(),
        matchaSell: Number(),
        matchaLatteSell: Number(),
        kapucinoSLactoseFreeSell: Number(),
        kapucinoMLactoseFreeSell: Number(),
        kapucinoLLactoseFreeSell: Number(),
        latteSLactoseFreeSell: Number(),
        latteMLactoseFreeSell: Number(),
        latteLLactoseFreeSell: Number(),
        nesquikSLactoseFreeSell: Number(),
        cacaoNaturalLactoseFreeSell: Number(),
        fletWhiteSLactoseFreeSell: Number(),
        kapucinoSVegetableSell: Number(),
        kapucinoMVegetableSell: Number(),
        latteSVegetableSell: Number(),
        latteMVegetableSell: Number(),
        cacaoNaturalVegetableSell: Number(),
        fletWhiteSVegetableSell: Number(),
        jarIceCreamSell: Number(),
        jarSorbetSell: Number(),
        iceCream001Sell: Number(),
        iceCream001PCS2Sell: Number(),
        iceCream001PCS3Sell: Number(),
        iceCream002Sell: Number(),
        iceCream002PCS2Sell: Number(),
        iceCream002PCS3Sell: Number(),
        iceCream003Sell: Number(),
        iceCream003PCS2Sell: Number(),
        iceCream003PCS3Sell: Number(),
        iceCream004Sell: Number(),
        iceCream004PCS2Sell: Number(),
        iceCream004PCS3Sell: Number(),
        waffle001Sell: Number(),
        waffle002Sell: Number(),
        waffle003Sell: Number(),
        waffle004Sell: Number(),
        waffle005Sell: Number(),
        waffle006Sell: Number(),
        waffle007Sell: Number(),
        waffle008Sell: Number(),
        waffle009Sell: Number(),
        waffle0091Sell: Number(),
        waffle010Sell: Number(),
        waffle0101Sell: Number(),
        waffle011Sell: Number(),
        waffle012Sell: Number(),
        waffle013Sell: Number(),
        waffle014Sell: Number(),
        waffle015Sell: Number()
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
        iceCream003Summ = count.iceCream003 = count.iceCream003PCS2 = count.iceCream003PCS3 = document.getElementById("iceCream003").value = 0;
        iceCream004Summ = count.iceCream004 = count.iceCream004PCS2 = count.iceCream004PCS3 = document.getElementById("iceCream004").value = 0;
        waffle001Summ = count.waffle001 = document.getElementById("waffle001").value = 0;
        waffle002Summ = count.waffle002 = document.getElementById("waffle002").value = 0;
        waffle003Summ = count.waffle003 = document.getElementById("waffle003").value = 0;
        waffle004Summ = count.waffle004 = document.getElementById("waffle004").value = 0;
        waffle005Summ = count.waffle005 = document.getElementById("waffle005").value = 0;
        waffle006Summ = count.waffle006 = document.getElementById("waffle006").value = 0;
        waffle007Summ = count.waffle007 = document.getElementById("waffle007").value = 0;
        waffle008Summ = count.waffle008 = document.getElementById("waffle008").value = 0;
        waffle009Summ = count.waffle009 = document.getElementById("waffle009").value = 0;
        waffle0091Summ = count.waffle0091 = document.getElementById("waffle0091").value = 0;
        waffle010Summ = count.waffle010 = document.getElementById("waffle010").value = 0;
        waffle0101Summ = count.waffle0101 = document.getElementById("waffle0101").value = 0;
        waffle011Summ = count.waffle011 = document.getElementById("waffle011").value = 0;
        waffle012Summ = count.waffle012 = document.getElementById("waffle012").value = 0;
        waffle013Summ = count.waffle013 = document.getElementById("waffle013").value = 0;
        waffle014Summ = count.waffle014 = document.getElementById("waffle014").value = 0;
        waffle015Summ = count.waffle015 = document.getElementById("waffle015").value = 0;
        chek.value = chekSumm = 0;
        document.getElementById("beforeMoney").value = "";
        sellCount = 0;
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
        console.log(sellCount);
        if (sellCount) {
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
                iceCream002PCS3: reportCountObject.iceCream002PCS3 + +count.iceCream002PCS3,
                iceCream003: reportCountObject.iceCream003 + +count.iceCream003,
                iceCream003PCS2: reportCountObject.iceCream003PCS2 + +count.iceCream003PCS2,
                iceCream003PCS3: reportCountObject.iceCream003PCS3 + +count.iceCream003PCS3,
                iceCream004: reportCountObject.iceCream004 + +count.iceCream004,
                iceCream004PCS2: reportCountObject.iceCream004PCS2 + +count.iceCream004PCS2,
                iceCream004PCS3: reportCountObject.iceCream004PCS3 + +count.iceCream004PCS3,
                waffle001: reportCountObject.waffle001 + +count.waffle001,
                waffle002: reportCountObject.waffle002 + +count.waffle002,
                waffle003: reportCountObject.waffle003 + +count.waffle003,
                waffle004: reportCountObject.waffle004 + +count.waffle004,
                waffle005: reportCountObject.waffle005 + +count.waffle005,
                waffle006: reportCountObject.waffle006 + +count.waffle006,
                waffle007: reportCountObject.waffle007 + +count.waffle007,
                waffle008: reportCountObject.waffle008 + +count.waffle008,
                waffle009: reportCountObject.waffle009 + +count.waffle009,
                waffle0091: reportCountObject.waffle0091 + +count.waffle0091,
                waffle010: reportCountObject.waffle010 + +count.waffle010,
                waffle0101: reportCountObject.waffle0101 + +count.waffle0101,
                waffle011: reportCountObject.waffle011 + +count.waffle011,
                waffle012: reportCountObject.waffle012 + +count.waffle012,
                waffle013: reportCountObject.waffle013 + +count.waffle013,
                waffle014: reportCountObject.waffle014 + +count.waffle014,
                waffle015: reportCountObject.waffle015 + +count.waffle015,
                espressoSell: reportCountObject.espressoSell + +count.espresso,
                americanoSell: reportCountObject.americanoSell + +count.americano,
                dopioSell: reportCountObject.dopioSell + +count.dopio,
                kapucinoSSell: reportCountObject.kapucinoSSell + +count.kapucinoS,
                kapucinoMSell: reportCountObject.kapucinoMSell + +count.kapucinoM,
                kapucinoLSell: reportCountObject.kapucinoLSell + +count.kapucinoL,
                latteSSell: reportCountObject.latteSSell + +count.latteS,
                latteMSell: reportCountObject.latteMSell + +count.latteM,
                latteLSell: reportCountObject.latteLSell + +count.latteL,
                rafSSell: reportCountObject.rafSSell + +count.rafS,
                rafMSell: reportCountObject.rafMSell + +count.rafM,
                fletWhiteSSell: reportCountObject.fletWhiteSSell + +count.fletWhiteS,
                fletWhiteMSell: reportCountObject.fletWhiteMSell + +count.fletWhiteM,
                creamSell: reportCountObject.creamSell + +count.cream,
                syrupSell: reportCountObject.syrupSell + +count.syrup,
                milkSell: reportCountObject.milkSell + +count.milk,
                vegetableMilkSell: reportCountObject.vegetableMilkSell + +count.vegetableMilk,
                lactoseFreeMilkSell: reportCountObject.lactoseFreeMilkSell + +count.lactoseFreeMilk,
                peanutSell: reportCountObject.peanutSell + +count.peanut,
                coconutShavingsSell: reportCountObject.coconutShavingsSell + +count.coconutShavings,
                marshmellowSell: reportCountObject.marshmellowSell + +count.marshmellow,
                oreoCoffeSell: reportCountObject.oreoCoffeSell + +count.oreoCoffe,
                lionCoffeSell: reportCountObject.lionCoffeSell + +count.lionCoffe,
                bananaCoffeSell: reportCountObject.bananaCoffeSell + +count.bananaCoffe,
                coconutCoffeSell: reportCountObject.coconutCoffeSell + +count.coconutCoffe,
                kendyNutCoffeSell: reportCountObject.kendyNutCoffeSell + +count.kendyNutCoffe,
                mmsCoffeSell: reportCountObject.mmsCoffeSell + +count.mmsCoffe,
                cherryCoffeSell: reportCountObject.cherryCoffeSell + +count.cherryCoffe,
                glyaseCoffeSell: reportCountObject.glyaseCoffeSell + +count.glyaseCoffe,
                kakaoRainbowCoffeSell: reportCountObject.kakaoRainbowCoffeSell + +count.kakaoRainbowCoffe,
                coldLatteSell: reportCountObject.coldLatteSell + +count.coldLatte,
                tigerLatteSell: reportCountObject.tigerLatteSell + +count.tigerLatte,
                fruitMexicanSell: reportCountObject.fruitMexicanSell + +count.fruitMexican,
                teeSell: reportCountObject.teeSell + +count.tee,
                ekoTeeSell: reportCountObject.ekoTeeSell + +count.ekoTee,
                chokolateSell: reportCountObject.chokolateSell + +count.chokolate,
                chokolatePlusSell: reportCountObject.chokolatePlusSell + +count.chokolatePlus,
                mulledWineSell: reportCountObject.mulledWineSell + +count.mulledWine,
                cacaoNaturalSell: reportCountObject.cacaoNaturalSell + +count.cacaoNatural,
                nesquikSSell: reportCountObject.nesquikSSell + +count.nesquikS,
                nesquikMSell: reportCountObject.nesquikMSell + +count.nesquikM,
                matchaSell: reportCountObject.matchaSell + +count.matcha,
                matchaLatteSell: reportCountObject.matchaLatteSell + +count.matchaLatte,
                kapucinoSLactoseFreeSell: reportCountObject.kapucinoSLactoseFreeSell + +count.kapucinoSLactoseFree,
                kapucinoMLactoseFreeSell: reportCountObject.kapucinoMLactoseFreeSell + +count.kapucinoMLactoseFree,
                kapucinoLLactoseFreeSell: reportCountObject.kapucinoLLactoseFreeSell + +count.kapucinoLLactoseFree,
                latteSLactoseFreeSell: reportCountObject.latteSLactoseFreeSell + +count.latteSLactoseFree,
                latteMLactoseFreeSell: reportCountObject.latteMLactoseFreeSell + +count.latteMLactoseFree,
                latteLLactoseFreeSell: reportCountObject.latteLLactoseFreeSell + +count.latteLLactoseFree,
                nesquikSLactoseFreeSell: reportCountObject.nesquikSLactoseFreeSell + +count.nesquikSLactoseFree,
                cacaoNaturalLactoseFreeSell: reportCountObject.cacaoNaturalLactoseFreeSell + +count.cacaoNaturalLactoseFree,
                fletWhiteSLactoseFreeSell: reportCountObject.fletWhiteSLactoseFreeSell + +count.fletWhiteSLactoseFree,
                kapucinoSVegetableSell: reportCountObject.kapucinoSVegetableSell + +count.kapucinoSVegetable,
                kapucinoMVegetableSell: reportCountObject.kapucinoMVegetableSell + +count.kapucinoMVegetable,
                latteSVegetableSell: reportCountObject.latteSVegetableSell + +count.latteSVegetable,
                latteMVegetableSell: reportCountObject.latteMVegetableSell + +count.latteMVegetable,
                cacaoNaturalVegetableSell: reportCountObject.cacaoNaturalVegetableSell + +count.cacaoNaturalVegetable,
                fletWhiteSVegetableSell: reportCountObject.fletWhiteSVegetableSell + +count.fletWhiteSVegetable,
                jarIceCreamSell: reportCountObject.jarIceCreamSell + +count.jarIceCream,
                jarSorbetSell: reportCountObject.jarSorbetSell + +count.jarSorbet,
                iceCream001Sell: reportCountObject.iceCream001Sell + +count.iceCream001,
                iceCream001PCS2Sell: reportCountObject.iceCream001PCS2Sell + +count.iceCream001PCS2,
                iceCream001PCS3Sell: reportCountObject.iceCream001PCS3Sell + +count.iceCream001PCS3,
                iceCream002Sell: reportCountObject.iceCream002Sell + +count.iceCream002,
                iceCream002PCS2Sell: reportCountObject.iceCream002PCS2Sell + +count.iceCream002PCS2,
                iceCream002PCS3Sell: reportCountObject.iceCream002PCS3Sell + +count.iceCream002PCS3,
                iceCream003Sell: reportCountObject.iceCream003Sell + +count.iceCream003,
                iceCream003PCS2Sell: reportCountObject.iceCream003PCS2Sell + +count.iceCream003PCS2,
                iceCream003PCS3Sell: reportCountObject.iceCream003PCS3Sell + +count.iceCream003PCS3,
                iceCream004Sell: reportCountObject.iceCream004Sell + +count.iceCream004,
                iceCream004PCS2Sell: reportCountObject.iceCream004PCS2Sell + +count.iceCream004PCS2,
                iceCream004PCS3Sell: reportCountObject.iceCream004PCS3Sell + +count.iceCream004PCS3,
                waffle001Sell: reportCountObject.waffle001Sell + +count.waffle001,
                waffle002Sell: reportCountObject.waffle002Sell + +count.waffle002,
                waffle003Sell: reportCountObject.waffle003Sell + +count.waffle003,
                waffle004Sell: reportCountObject.waffle004Sell + +count.waffle004,
                waffle005Sell: reportCountObject.waffle005Sell + +count.waffle005,
                waffle006Sell: reportCountObject.waffle006Sell + +count.waffle006,
                waffle007Sell: reportCountObject.waffle007Sell + +count.waffle007,
                waffle008Sell: reportCountObject.waffle008Sell + +count.waffle008,
                waffle009Sell: reportCountObject.waffle009Sell + +count.waffle009,
                waffle0091Sell: reportCountObject.waffle0091Sell + +count.waffle0091,
                waffle010Sell: reportCountObject.waffle010Sell + +count.waffle010,
                waffle0101Sell: reportCountObject.waffle0101Sell + +count.waffle0101,
                waffle011Sell: reportCountObject.waffle011Sell + +count.waffle011,
                waffle012Sell: reportCountObject.waffle012Sell + +count.waffle012,
                waffle013Sell: reportCountObject.waffle013Sell + +count.waffle013,
                waffle014Sell: reportCountObject.waffle014Sell + +count.waffle014,
                waffle015Sell: reportCountObject.waffle015Sell + +count.waffle015
            };
            console.log(reportCountObject.espressoSell);
        } else reportCountObject = {
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
            iceCream002PCS3: reportCountObject.iceCream002PCS3 + +count.iceCream002PCS3,
            iceCream003: reportCountObject.iceCream003 + +count.iceCream003,
            iceCream003PCS2: reportCountObject.iceCream003PCS2 + +count.iceCream003PCS2,
            iceCream003PCS3: reportCountObject.iceCream003PCS3 + +count.iceCream003PCS3,
            iceCream004: reportCountObject.iceCream004 + +count.iceCream004,
            iceCream004PCS2: reportCountObject.iceCream004PCS2 + +count.iceCream004PCS2,
            iceCream004PCS3: reportCountObject.iceCream004PCS3 + +count.iceCream004PCS3,
            waffle001: reportCountObject.waffle001 + +count.waffle001,
            waffle002: reportCountObject.waffle002 + +count.waffle002,
            waffle003: reportCountObject.waffle003 + +count.waffle003,
            waffle004: reportCountObject.waffle004 + +count.waffle004,
            waffle005: reportCountObject.waffle005 + +count.waffle005,
            waffle006: reportCountObject.waffle006 + +count.waffle006,
            waffle007: reportCountObject.waffle007 + +count.waffle007,
            waffle008: reportCountObject.waffle008 + +count.waffle008,
            waffle009: reportCountObject.waffle009 + +count.waffle009,
            waffle0091: reportCountObject.waffle0091 + +count.waffle0091,
            waffle010: reportCountObject.waffle010 + +count.waffle010,
            waffle0101: reportCountObject.waffle0101 + +count.waffle0101,
            waffle011: reportCountObject.waffle011 + +count.waffle011,
            waffle012: reportCountObject.waffle012 + +count.waffle012,
            waffle013: reportCountObject.waffle013 + +count.waffle013,
            waffle014: reportCountObject.waffle014 + +count.waffle014,
            waffle015: reportCountObject.waffle015 + +count.waffle015,
            espressoSell: reportCountObject.espressoSell,
            americanoSell: reportCountObject.americanoSell,
            dopioSell: reportCountObject.dopioSell,
            kapucinoSSell: reportCountObject.kapucinoSSell,
            kapucinoMSell: reportCountObject.kapucinoMSell,
            kapucinoLSell: reportCountObject.kapucinoLSell,
            latteSSell: reportCountObject.latteSSell,
            latteMSell: reportCountObject.latteMSell,
            latteLSell: reportCountObject.latteLSell,
            rafSSell: reportCountObject.rafSSell,
            rafMSell: reportCountObject.rafMSell,
            fletWhiteSSell: reportCountObject.fletWhiteSSell,
            fletWhiteMSell: reportCountObject.fletWhiteMSell,
            creamSell: reportCountObject.creamSell,
            syrupSell: reportCountObject.syrupSell,
            milkSell: reportCountObject.milkSell,
            vegetableMilkSell: reportCountObject.vegetableMilkSell,
            lactoseFreeMilkSell: reportCountObject.lactoseFreeMilkSell,
            peanutSell: reportCountObject.peanutSell,
            coconutShavingsSell: reportCountObject.coconutShavingsSell,
            marshmellowSell: reportCountObject.marshmellowSell,
            oreoCoffeSell: reportCountObject.oreoCoffeSell,
            lionCoffeSell: reportCountObject.lionCoffeSell,
            bananaCoffeSell: reportCountObject.bananaCoffeSell,
            coconutCoffeSell: reportCountObject.coconutCoffeSell,
            kendyNutCoffeSell: reportCountObject.kendyNutCoffeSell,
            mmsCoffeSell: reportCountObject.mmsCoffeSell,
            cherryCoffeSell: reportCountObject.cherryCoffeSell,
            glyaseCoffeSell: reportCountObject.glyaseCoffeSell,
            kakaoRainbowCoffeSell: reportCountObject.kakaoRainbowCoffeSell,
            coldLatteSell: reportCountObject.coldLatteSell,
            tigerLatteSell: reportCountObject.tigerLatteSell,
            fruitMexicanSell: reportCountObject.fruitMexicanSell,
            teeSell: reportCountObject.teeSell,
            ekoTeeSell: reportCountObject.ekoTeeSell,
            chokolateSell: reportCountObject.chokolateSell,
            chokolatePlusSell: reportCountObject.chokolatePlusSell,
            mulledWineSell: reportCountObject.mulledWineSell,
            cacaoNaturalSell: reportCountObject.cacaoNaturalSell,
            nesquikSSell: reportCountObject.nesquikSSell,
            nesquikMSell: reportCountObject.nesquikMSell,
            matchaSell: reportCountObject.matchaSell,
            matchaLatteSell: reportCountObject.matchaLatteSell,
            kapucinoSLactoseFreeSell: reportCountObject.kapucinoSLactoseFreeSell,
            kapucinoMLactoseFreeSell: reportCountObject.kapucinoMLactoseFreeSell,
            kapucinoLLactoseFreeSell: reportCountObject.kapucinoLLactoseFreeSell,
            latteSLactoseFreeSell: reportCountObject.latteSLactoseFreeSell,
            latteMLactoseFreeSell: reportCountObject.latteMLactoseFreeSell,
            latteLLactoseFreeSell: reportCountObject.latteLLactoseFreeSell,
            nesquikSLactoseFreeSell: reportCountObject.nesquikSLactoseFreeSell,
            cacaoNaturalLactoseFreeSell: reportCountObject.cacaoNaturalLactoseFreeSell,
            fletWhiteSLactoseFreeSell: reportCountObject.fletWhiteSLactoseFreeSell,
            kapucinoSVegetableSell: reportCountObject.kapucinoSVegetableSell,
            kapucinoMVegetableSell: reportCountObject.kapucinoMVegetableSell,
            latteSVegetableSell: reportCountObject.latteSVegetableSell,
            latteMVegetableSell: reportCountObject.latteMVegetableSell,
            cacaoNaturalVegetableSell: reportCountObject.cacaoNaturalVegetableSell,
            fletWhiteSVegetableSell: reportCountObject.fletWhiteSVegetableSell,
            jarIceCreamSell: reportCountObject.jarIceCreamSell,
            jarSorbetSell: reportCountObject.jarSorbetSell,
            iceCream001Sell: reportCountObject.iceCream001Sell,
            iceCream001PCS2Sell: reportCountObject.iceCream001PCS2Sell,
            iceCream001PCS3Sell: reportCountObject.iceCream001PCS3Sell,
            iceCream002Sell: reportCountObject.iceCream002Sell,
            iceCream002PCS2Sell: reportCountObject.iceCream002PCS2Sell,
            iceCream002PCS3Sell: reportCountObject.iceCream002PCS3Sell,
            iceCream003Sell: reportCountObject.iceCream003Sell,
            iceCream003PCS2Sell: reportCountObject.iceCream003PCS2Sell,
            iceCream003PCS3Sell: reportCountObject.iceCream003PCS3Sell,
            iceCream004Sell: reportCountObject.iceCream004Sell,
            iceCream004PCS2Sell: reportCountObject.iceCream004PCS2Sell,
            iceCream004PCS3Sell: reportCountObject.iceCream004PCS3Sell,
            waffle001Sell: reportCountObject.waffle001Sell,
            waffle002Sell: reportCountObject.waffle002Sell,
            waffle003Sell: reportCountObject.waffle003Sell,
            waffle004Sell: reportCountObject.waffle004Sell,
            waffle005Sell: reportCountObject.waffle005Sell,
            waffle006Sell: reportCountObject.waffle006Sell,
            waffle007Sell: reportCountObject.waffle007Sell,
            waffle008Sell: reportCountObject.waffle008Sell,
            waffle009Sell: reportCountObject.waffle009Sell,
            waffle0091Sell: reportCountObject.waffle0091Sell,
            waffle010Sell: reportCountObject.waffle010Sell,
            waffle0101Sell: reportCountObject.waffle0101Sell,
            waffle011Sell: reportCountObject.waffle011Sell,
            waffle012Sell: reportCountObject.waffle012Sell,
            waffle013Sell: reportCountObject.waffle013Sell,
            waffle014Sell: reportCountObject.waffle014Sell,
            waffle015Sell: reportCountObject.waffle015Sell
        };
    }
    function reportSaveCountValue() {
        reportEspressoValue.value = reportCountObject.espresso;
        if (reportEspressoValue.value > 0) {
            parent = reportEspressoValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportEspressoValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportAmericanoValue.value = reportCountObject.americano;
        if (reportAmericanoValue.value > 0) {
            parent = reportAmericanoValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportAmericanoValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportDopioValue.value = reportCountObject.dopio;
        if (reportDopioValue.value > 0) {
            parent = reportDopioValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportDopioValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoSValue.value = reportCountObject.kapucinoS;
        if (reportKapucinoSValue.value > 0) {
            parent = reportKapucinoSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoMValue.value = reportCountObject.kapucinoM;
        if (reportKapucinoMValue.value > 0) {
            parent = reportKapucinoMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoLValue.value = reportCountObject.kapucinoL;
        if (reportKapucinoLValue.value > 0) {
            parent = reportKapucinoLValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoLValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteSValue.value = reportCountObject.latteS;
        if (reportLatteSValue.value > 0) {
            parent = reportLatteSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteMValue.value = reportCountObject.latteM;
        if (reportLatteMValue.value > 0) {
            parent = reportLatteMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteLValue.value = reportCountObject.latteL;
        if (reportLatteLValue.value > 0) {
            parent = reportLatteLValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteLValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportRafSValue.value = reportCountObject.rafS;
        if (reportRafSValue.value > 0) {
            parent = reportRafSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportRafSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportRafMValue.value = reportCountObject.rafM;
        if (reportRafMValue.value > 0) {
            parent = reportRafMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportRafMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportFletWhiteSValue.value = reportCountObject.fletWhiteS;
        if (reportFletWhiteSValue.value > 0) {
            parent = reportFletWhiteSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportFletWhiteSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportFletWhiteMValue.value = reportCountObject.fletWhiteM;
        if (reportFletWhiteMValue.value > 0) {
            parent = reportFletWhiteMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportFletWhiteMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCreamValue.value = reportCountObject.cream;
        if (reportCreamValue.value > 0) {
            parent = reportCreamValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCreamValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSyrupValue.value = reportCountObject.syrup;
        if (reportSyrupValue.value > 0) {
            parent = reportSyrupValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSyrupValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportMilkValue.value = reportCountObject.milk;
        if (reportMilkValue.value > 0) {
            parent = reportMilkValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportMilkValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportVegetableMilkValue.value = reportCountObject.vegetableMilk;
        if (reportVegetableMilkValue.value > 0) {
            parent = reportVegetableMilkValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportVegetableMilkValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLactoseFreeMilkValue.value = reportCountObject.lactoseFreeMilk;
        if (reportLactoseFreeMilkValue.value > 0) {
            parent = reportLactoseFreeMilkValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLactoseFreeMilkValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportPeanutValue.value = reportCountObject.peanut;
        if (reportPeanutValue.value > 0) {
            parent = reportPeanutValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportPeanutValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCoconutShavingsValue.value = reportCountObject.coconutShavings;
        if (reportCoconutShavingsValue.value > 0) {
            parent = reportCoconutShavingsValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCoconutShavingsValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportMarshmellowValue.value = reportCountObject.marshmellow;
        if (reportMarshmellowValue.value > 0) {
            parent = reportMarshmellowValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportMarshmellowValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportOreoCoffeValue.value = reportCountObject.oreoCoffe;
        if (reportOreoCoffeValue.value > 0) {
            parent = reportOreoCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportOreoCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLionCoffeValue.value = reportCountObject.lionCoffe;
        if (reportLionCoffeValue.value > 0) {
            parent = reportLionCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLionCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportBananaCoffeValue.value = reportCountObject.bananaCoffe;
        if (reportBananaCoffeValue.value > 0) {
            parent = reportBananaCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportBananaCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCoconutCoffeValue.value = reportCountObject.coconutCoffe;
        if (reportCoconutCoffeValue.value > 0) {
            parent = reportCoconutCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCoconutCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKendyNutCoffeValue.value = reportCountObject.kendyNutCoffe;
        if (reportKendyNutCoffeValue.value > 0) {
            parent = reportKendyNutCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKendyNutCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportMmsCoffeValue.value = reportCountObject.mmsCoffe;
        if (reportMmsCoffeValue.value > 0) {
            parent = reportMmsCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportMmsCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCherryCoffeValue.value = reportCountObject.cherryCoffe;
        if (reportCherryCoffeValue.value > 0) {
            parent = reportCherryCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCherryCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportGlyaseCoffeValue.value = reportCountObject.glyaseCoffe;
        if (reportGlyaseCoffeValue.value > 0) {
            parent = reportGlyaseCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportGlyaseCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKakaoRainbowCoffeValue.value = reportCountObject.kakaoRainbowCoffe;
        if (reportKakaoRainbowCoffeValue.value > 0) {
            parent = reportKakaoRainbowCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKakaoRainbowCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportColdLatteValue.value = reportCountObject.coldLatte;
        if (reportColdLatteValue.value > 0) {
            parent = reportColdLatteValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportColdLatteValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportTigerLatteValue.value = reportCountObject.tigerLatte;
        if (reportTigerLatteValue.value > 0) {
            parent = reportTigerLatteValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportTigerLatteValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportFruitMexicanValue.value = reportCountObject.fruitMexican;
        if (reportFruitMexicanValue.value > 0) {
            parent = reportFruitMexicanValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportFruitMexicanValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportTeeValue.value = reportCountObject.tee;
        if (reportTeeValue.value > 0) {
            parent = reportTeeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportTeeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportEkoTeeValue.value = reportCountObject.ekoTee;
        if (reportEkoTeeValue.value > 0) {
            parent = reportEkoTeeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportEkoTeeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportChokolateValue.value = reportCountObject.chokolate;
        if (reportChokolateValue.value > 0) {
            parent = reportChokolateValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportChokolateValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportChokolatePlusValue.value = reportCountObject.chokolatePlus;
        if (reportChokolatePlusValue.value > 0) {
            parent = reportChokolatePlusValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportChokolatePlusValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportMulledWineValue.value = reportCountObject.mulledWine;
        if (reportMulledWineValue.value > 0) {
            parent = reportMulledWineValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportMulledWineValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCacaoNaturalValue.value = reportCountObject.cacaoNatural;
        if (reportCacaoNaturalValue.value > 0) {
            parent = reportCacaoNaturalValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCacaoNaturalValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportNesquikSValue.value = reportCountObject.nesquikS;
        if (reportNesquikSValue.value > 0) {
            parent = reportNesquikSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportNesquikSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportNesquikMValue.value = reportCountObject.nesquikM;
        if (reportNesquikMValue.value > 0) {
            parent = reportNesquikMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportNesquikMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportMatchaValue.value = reportCountObject.matcha;
        if (reportMatchaValue.value > 0) {
            parent = reportMatchaValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportMatchaValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportMatchaLatteValue.value = reportCountObject.matchaLatte;
        if (reportMatchaLatteValue.value > 0) {
            parent = reportMatchaLatteValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportMatchaLatteValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoSLactoseFreeValue.value = reportCountObject.kapucinoSLactoseFree;
        if (reportKapucinoSLactoseFreeValue.value > 0) {
            parent = reportKapucinoSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoMLactoseFreeValue.value = reportCountObject.kapucinoMLactoseFree;
        if (reportKapucinoMLactoseFreeValue.value > 0) {
            parent = reportKapucinoMLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoMLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoLLactoseFreeValue.value = reportCountObject.kapucinoLLactoseFree;
        if (reportKapucinoLLactoseFreeValue.value > 0) {
            parent = reportKapucinoLLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoLLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteSLactoseFreeValue.value = reportCountObject.latteSLactoseFree;
        if (reportLatteSLactoseFreeValue.value > 0) {
            parent = reportLatteSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteMLactoseFreeValue.value = reportCountObject.latteMLactoseFree;
        if (reportLatteMLactoseFreeValue.value > 0) {
            parent = reportLatteMLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteMLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteLLactoseFreeValue.value = reportCountObject.latteLLactoseFree;
        if (reportLatteLLactoseFreeValue.value > 0) {
            parent = reportLatteLLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteLLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportNesquikSLactoseFreeValue.value = reportCountObject.nesquikSLactoseFree;
        if (reportNesquikSLactoseFreeValue.value > 0) {
            parent = reportNesquikSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportNesquikSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCacaoNaturalLactoseFreeValue.value = reportCountObject.cacaoNaturalLactoseFree;
        if (reportCacaoNaturalLactoseFreeValue.value > 0) {
            parent = reportCacaoNaturalLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCacaoNaturalLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportFletWhiteSLactoseFreeValue.value = reportCountObject.fletWhiteSLactoseFree;
        if (reportFletWhiteSLactoseFreeValue.value > 0) {
            parent = reportFletWhiteSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportFletWhiteSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoSVegetableValue.value = reportCountObject.kapucinoSVegetable;
        if (reportKapucinoSVegetableValue.value > 0) {
            parent = reportKapucinoSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoSVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportKapucinoMVegetableValue.value = reportCountObject.kapucinoMVegetable;
        if (reportKapucinoMVegetableValue.value > 0) {
            parent = reportKapucinoMVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportKapucinoMVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteSVegetableValue.value = reportCountObject.latteSVegetable;
        if (reportLatteSVegetableValue.value > 0) {
            parent = reportLatteSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteSVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportLatteMVegetableValue.value = reportCountObject.latteMVegetable;
        if (reportLatteMVegetableValue.value > 0) {
            parent = reportLatteMVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportLatteMVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportCacaoNaturalVegetableValue.value = reportCountObject.cacaoNaturalVegetable;
        if (reportCacaoNaturalVegetableValue.value > 0) {
            parent = reportCacaoNaturalVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportCacaoNaturalVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportFletWhiteSVegetableValue.value = reportCountObject.fletWhiteSVegetable;
        if (reportFletWhiteSVegetableValue.value > 0) {
            parent = reportFletWhiteSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportFletWhiteSVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportJarIceCreamValue.value = reportCountObject.jarIceCream;
        if (reportJarIceCreamValue.value > 0) {
            parent = reportJarIceCreamValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportJarIceCreamValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportJarSorbetValue.value = reportCountObject.jarSorbet;
        if (reportJarSorbetValue.value > 0) {
            parent = reportJarSorbetValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportJarSorbetValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream001Value.value = reportCountObject.iceCream001;
        if (reportIceCream001Value.value > 0) {
            parent = reportIceCream001Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream001Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream001PCS2Value.value = reportCountObject.iceCream001PCS2;
        if (reportIceCream001PCS2Value.value > 0) {
            parent = reportIceCream001PCS2Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream001PCS2Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream001PCS3Value.value = reportCountObject.iceCream001PCS3;
        if (reportIceCream001PCS3Value.value > 0) {
            parent = reportIceCream001PCS3Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream001PCS3Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream002Value.value = reportCountObject.iceCream002;
        if (reportIceCream002Value.value > 0) {
            parent = reportIceCream002Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream002Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream002PCS2Value.value = reportCountObject.iceCream002PCS2;
        if (reportIceCream002PCS2Value.value > 0) {
            parent = reportIceCream002PCS2Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream002PCS2Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream002PCS3Value.value = reportCountObject.iceCream002PCS3;
        if (reportIceCream002PCS3Value.value > 0) {
            parent = reportIceCream002PCS3Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream002PCS3Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream003Value.value = reportCountObject.iceCream003;
        if (reportIceCream003Value.value > 0) {
            parent = reportIceCream003Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream003Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream003PCS2Value.value = reportCountObject.iceCream003PCS2;
        if (reportIceCream003PCS2Value.value > 0) {
            parent = reportIceCream003PCS2Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream003PCS2Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream003PCS3Value.value = reportCountObject.iceCream003PCS3;
        if (reportIceCream003PCS3Value.value > 0) {
            parent = reportIceCream003PCS3Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream003PCS3Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream004Value.value = reportCountObject.iceCream004;
        if (reportIceCream004Value.value > 0) {
            parent = reportIceCream004Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream004Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream004PCS2Value.value = reportCountObject.iceCream004PCS2;
        if (reportIceCream004PCS2Value.value > 0) {
            parent = reportIceCream004PCS2Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream004PCS2Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportIceCream004PCS3Value.value = reportCountObject.iceCream004PCS3;
        if (reportIceCream004PCS3Value.value > 0) {
            parent = reportIceCream004PCS3Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportIceCream004PCS3Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle001Value.value = reportCountObject.waffle001;
        if (reportWaffle001Value.value > 0) {
            parent = reportWaffle001Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle001Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle002Value.value = reportCountObject.waffle002;
        if (reportWaffle002Value.value > 0) {
            parent = reportWaffle002Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle002Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle003Value.value = reportCountObject.waffle003;
        if (reportWaffle003Value.value > 0) {
            parent = reportWaffle003Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle003Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle004Value.value = reportCountObject.waffle004;
        if (reportWaffle004Value.value > 0) {
            parent = reportWaffle004Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle004Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle005Value.value = reportCountObject.waffle005;
        if (reportWaffle005Value.value > 0) {
            parent = reportWaffle005Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle005Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle006Value.value = reportCountObject.waffle006;
        if (reportWaffle006Value.value > 0) {
            parent = reportWaffle006Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle006Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle007Value.value = reportCountObject.waffle007;
        if (reportWaffle007Value.value > 0) {
            parent = reportWaffle007Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle007Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle008Value.value = reportCountObject.waffle008;
        if (reportWaffle008Value.value > 0) {
            parent = reportWaffle008Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle008Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle009Value.value = reportCountObject.waffle009;
        if (reportWaffle009Value.value > 0) {
            parent = reportWaffle009Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle009Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle0091Value.value = reportCountObject.waffle0091;
        if (reportWaffle0091Value.value > 0) {
            parent = reportWaffle0091Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle0091Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle010Value.value = reportCountObject.waffle010;
        if (reportWaffle010Value.value > 0) {
            parent = reportWaffle010Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle010Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle0101Value.value = reportCountObject.waffle0101;
        if (reportWaffle0101Value.value > 0) {
            parent = reportWaffle0101Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle0101Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle011Value.value = reportCountObject.waffle011;
        if (reportWaffle011Value.value > 0) {
            parent = reportWaffle011Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle011Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle012Value.value = reportCountObject.waffle012;
        if (reportWaffle012Value.value > 0) {
            parent = reportWaffle012Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle012Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle013Value.value = reportCountObject.waffle013;
        if (reportWaffle013Value.value > 0) {
            parent = reportWaffle013Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle013Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle014Value.value = reportCountObject.waffle014;
        if (reportWaffle014Value.value > 0) {
            parent = reportWaffle014Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle014Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportWaffle015Value.value = reportCountObject.waffle015;
        if (reportWaffle015Value.value > 0) {
            parent = reportWaffle015Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportWaffle015Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.espressoValue.value = reportCountObject.espressoSell;
        if (reportSellCount.espressoValue.value > 0) {
            parent = reportSellCount.espressoValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.espressoValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.americanoValue.value = reportCountObject.americanoSell;
        if (reportSellCount.americanoValue.value > 0) {
            parent = reportSellCount.americanoValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.americanoValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.dopioValue.value = reportCountObject.dopioSell;
        if (reportSellCount.dopioValue.value > 0) {
            parent = reportSellCount.dopioValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.dopioValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoSValue.value = reportCountObject.kapucinoSSell;
        if (reportSellCount.kapucinoSValue.value > 0) {
            parent = reportSellCount.kapucinoSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoMValue.value = reportCountObject.kapucinoMSell;
        if (reportSellCount.kapucinoMValue.value > 0) {
            parent = reportSellCount.kapucinoMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoLValue.value = reportCountObject.kapucinoLSell;
        if (reportSellCount.kapucinoLValue.value > 0) {
            parent = reportSellCount.kapucinoLValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoLValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteSValue.value = reportCountObject.latteSSell;
        if (reportSellCount.latteSValue.value > 0) {
            parent = reportSellCount.latteSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteMValue.value = reportCountObject.latteMSell;
        if (reportSellCount.latteMValue.value > 0) {
            parent = reportSellCount.latteMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteLValue.value = reportCountObject.latteLSell;
        if (reportSellCount.latteLValue.value > 0) {
            parent = reportSellCount.latteLValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteLValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.rafSValue.value = reportCountObject.rafSSell;
        if (reportSellCount.rafSValue.value > 0) {
            parent = reportSellCount.rafSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.rafSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.rafMValue.value = reportCountObject.rafMSell;
        if (reportSellCount.rafMValue.value > 0) {
            parent = reportSellCount.rafMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.rafMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.fletWhiteSValue.value = reportCountObject.fletWhiteSSell;
        if (reportSellCount.fletWhiteSValue.value > 0) {
            parent = reportSellCount.fletWhiteSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.fletWhiteSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.fletWhiteMValue.value = reportCountObject.fletWhiteMSell;
        if (reportSellCount.fletWhiteMValue.value > 0) {
            parent = reportSellCount.fletWhiteMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.fletWhiteMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.creamValue.value = reportCountObject.creamSell;
        if (reportSellCount.creamValue.value > 0) {
            parent = reportSellCount.creamValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.creamValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.syrupValue.value = reportCountObject.syrupSell;
        if (reportSellCount.syrupValue.value > 0) {
            parent = reportSellCount.syrupValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.syrupValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.milkValue.value = reportCountObject.milkSell;
        if (reportSellCount.milkValue.value > 0) {
            parent = reportSellCount.milkValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.milkValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.vegetableMilkValue.value = reportCountObject.vegetableMilkSell;
        if (reportSellCount.vegetableMilkValue.value > 0) {
            parent = reportSellCount.vegetableMilkValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.vegetableMilkValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.lactoseFreeMilkValue.value = reportCountObject.lactoseFreeMilkSell;
        if (reportSellCount.lactoseFreeMilkValue.value > 0) {
            parent = reportSellCount.lactoseFreeMilkValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.lactoseFreeMilkValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.peanutValue.value = reportCountObject.peanutSell;
        if (reportSellCount.peanutValue.value > 0) {
            parent = reportSellCount.peanutValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.peanutValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.coconutShavingsValue.value = reportCountObject.coconutShavingsSell;
        if (reportSellCount.coconutShavingsValue.value > 0) {
            parent = reportSellCount.coconutShavingsValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.coconutShavingsValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.marshmellowValue.value = reportCountObject.marshmellowSell;
        if (reportSellCount.marshmellowValue.value > 0) {
            parent = reportSellCount.marshmellowValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.marshmellowValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.oreoCoffeValue.value = reportCountObject.oreoCoffeSell;
        if (reportSellCount.oreoCoffeValue.value > 0) {
            parent = reportSellCount.oreoCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.oreoCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.lionCoffeValue.value = reportCountObject.lionCoffeSell;
        if (reportSellCount.lionCoffeValue.value > 0) {
            parent = reportSellCount.lionCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.lionCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.bananaCoffeValue.value = reportCountObject.bananaCoffeSell;
        if (reportSellCount.bananaCoffeValue.value > 0) {
            parent = reportSellCount.bananaCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.bananaCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.coconutCoffeValue.value = reportCountObject.coconutCoffeSell;
        if (reportSellCount.coconutCoffeValue.value > 0) {
            parent = reportSellCount.coconutCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.coconutCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kendyNutCoffeValue.value = reportCountObject.kendyNutCoffeSell;
        if (reportSellCount.kendyNutCoffeValue.value > 0) {
            parent = reportSellCount.kendyNutCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kendyNutCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.mmsCoffeValue.value = reportCountObject.mmsCoffeSell;
        if (reportSellCount.mmsCoffeValue.value > 0) {
            parent = reportSellCount.mmsCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.mmsCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.cherryCoffeValue.value = reportCountObject.cherryCoffeSell;
        if (reportSellCount.cherryCoffeValue.value > 0) {
            parent = reportSellCount.cherryCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.cherryCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.glyaseCoffeValue.value = reportCountObject.glyaseCoffeSell;
        if (reportSellCount.glyaseCoffeValue.value > 0) {
            parent = reportSellCount.glyaseCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.glyaseCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kakaoRainbowCoffeValue.value = reportCountObject.kakaoRainbowCoffeSell;
        if (reportSellCount.kakaoRainbowCoffeValue.value > 0) {
            parent = reportSellCount.kakaoRainbowCoffeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kakaoRainbowCoffeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.coldLatteValue.value = reportCountObject.coldLatteSell;
        if (reportSellCount.coldLatteValue.value > 0) {
            parent = reportSellCount.coldLatteValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.coldLatteValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.tigerLatteValue.value = reportCountObject.tigerLatteSell;
        if (reportSellCount.tigerLatteValue.value > 0) {
            parent = reportSellCount.tigerLatteValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.tigerLatteValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.fruitMexicanValue.value = reportCountObject.fruitMexicanSell;
        if (reportSellCount.fruitMexicanValue.value > 0) {
            parent = reportSellCount.fruitMexicanValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.fruitMexicanValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.teeValue.value = reportCountObject.teeSell;
        if (reportSellCount.teeValue.value > 0) {
            parent = reportSellCount.teeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.teeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.ekoTeeValue.value = reportCountObject.ekoTeeSell;
        if (reportSellCount.ekoTeeValue.value > 0) {
            parent = reportSellCount.ekoTeeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.ekoTeeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.chokolateValue.value = reportCountObject.chokolateSell;
        if (reportSellCount.chokolateValue.value > 0) {
            parent = reportSellCount.chokolateValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.chokolateValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.chokolatePlusValue.value = reportCountObject.chokolatePlusSell;
        if (reportSellCount.chokolatePlusValue.value > 0) {
            parent = reportSellCount.chokolatePlusValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.chokolatePlusValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.mulledWineValue.value = reportCountObject.mulledWineSell;
        if (reportSellCount.mulledWineValue.value > 0) {
            parent = reportSellCount.mulledWineValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.mulledWineValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.cacaoNaturalValue.value = reportCountObject.cacaoNaturalSell;
        if (reportSellCount.cacaoNaturalValue.value > 0) {
            parent = reportSellCount.cacaoNaturalValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.cacaoNaturalValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.nesquikSValue.value = reportCountObject.nesquikSSell;
        if (reportSellCount.nesquikSValue.value > 0) {
            parent = reportSellCount.nesquikSValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.nesquikSValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.nesquikMValue.value = reportCountObject.nesquikMSell;
        if (reportSellCount.nesquikMValue.value > 0) {
            parent = reportSellCount.nesquikMValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.nesquikMValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.matchaValue.value = reportCountObject.matchaSell;
        if (reportSellCount.matchaValue.value > 0) {
            parent = reportSellCount.matchaValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.matchaValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.matchaLatteValue.value = reportCountObject.matchaLatteSell;
        if (reportSellCount.matchaLatteValue.value > 0) {
            parent = reportSellCount.matchaLatteValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.matchaLatteValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoSLactoseFreeValue.value = reportCountObject.kapucinoSLactoseFreeSell;
        if (reportSellCount.kapucinoSLactoseFreeValue.value > 0) {
            parent = reportSellCount.kapucinoSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoMLactoseFreeValue.value = reportCountObject.kapucinoMLactoseFreeSell;
        if (reportSellCount.kapucinoMLactoseFreeValue.value > 0) {
            parent = reportSellCount.kapucinoMLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoMLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoLLactoseFreeValue.value = reportCountObject.kapucinoLLactoseFreeSell;
        if (reportSellCount.kapucinoLLactoseFreeValue.value > 0) {
            parent = reportSellCount.kapucinoLLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoLLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteSLactoseFreeValue.value = reportCountObject.latteSLactoseFreeSell;
        if (reportSellCount.latteSLactoseFreeValue.value > 0) {
            parent = reportSellCount.latteSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteMLactoseFreeValue.value = reportCountObject.latteMLactoseFreeSell;
        if (reportSellCount.latteMLactoseFreeValue.value > 0) {
            parent = reportSellCount.latteMLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteMLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteLLactoseFreeValue.value = reportCountObject.latteLLactoseFreeSell;
        if (reportSellCount.latteLLactoseFreeValue.value > 0) {
            parent = reportSellCount.latteLLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteLLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.nesquikSLactoseFreeValue.value = reportCountObject.nesquikSLactoseFreeSell;
        if (reportSellCount.nesquikSLactoseFreeValue.value > 0) {
            parent = reportSellCount.nesquikSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.nesquikSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.cacaoNaturalLactoseFreeValue.value = reportCountObject.cacaoNaturalLactoseFreeSell;
        if (reportSellCount.cacaoNaturalLactoseFreeValue.value > 0) {
            parent = reportSellCount.cacaoNaturalLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.cacaoNaturalLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.fletWhiteSLactoseFreeValue.value = reportCountObject.fletWhiteSLactoseFreeSell;
        if (reportSellCount.fletWhiteSLactoseFreeValue.value > 0) {
            parent = reportSellCount.fletWhiteSLactoseFreeValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.fletWhiteSLactoseFreeValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoSVegetableValue.value = reportCountObject.kapucinoSVegetableSell;
        if (reportSellCount.kapucinoSVegetableValue.value > 0) {
            parent = reportSellCount.kapucinoSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoSVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.kapucinoMVegetableValue.value = reportCountObject.kapucinoMVegetableSell;
        if (reportSellCount.kapucinoMVegetableValue.value > 0) {
            parent = reportSellCount.kapucinoMVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.kapucinoMVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteSVegetableValue.value = reportCountObject.latteSVegetableSell;
        if (reportSellCount.latteSVegetableValue.value > 0) {
            parent = reportSellCount.latteSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteSVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.latteMVegetableValue.value = reportCountObject.latteMVegetableSell;
        if (reportSellCount.latteMVegetableValue.value > 0) {
            parent = reportSellCount.latteMVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.latteMVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.cacaoNaturalVegetableValue.value = reportCountObject.cacaoNaturalVegetableSell;
        if (reportSellCount.cacaoNaturalVegetableValue.value > 0) {
            parent = reportSellCount.cacaoNaturalVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.cacaoNaturalVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.fletWhiteSVegetableValue.value = reportCountObject.fletWhiteSVegetableSell;
        if (reportSellCount.fletWhiteSVegetableValue.value > 0) {
            parent = reportSellCount.fletWhiteSVegetableValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.fletWhiteSVegetableValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.jarIceCreamValue.value = reportCountObject.jarIceCreamSell;
        if (reportSellCount.jarIceCreamValue.value > 0) {
            parent = reportSellCount.jarIceCreamValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.jarIceCreamValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.jarSorbetValue.value = reportCountObject.jarSorbetSell;
        if (reportSellCount.jarSorbetValue.value > 0) {
            parent = reportSellCount.jarSorbetValue.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.jarSorbetValue.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream001Value.value = reportCountObject.iceCream001Sell;
        if (reportSellCount.iceCream001Value.value > 0) {
            parent = reportSellCount.iceCream001Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream001Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream001ValuePCS2.value = reportCountObject.iceCream001PCS2Sell;
        if (reportSellCount.iceCream001ValuePCS2.value > 0) {
            parent = reportSellCount.iceCream001ValuePCS2.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream001ValuePCS2.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream001ValuePCS3.value = reportCountObject.iceCream001PCS3Sell;
        if (reportSellCount.iceCream001ValuePCS3.value > 0) {
            parent = reportSellCount.iceCream001ValuePCS3.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream001ValuePCS3.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream002Value.value = reportCountObject.iceCream002Sell;
        if (reportSellCount.iceCream002Value.value > 0) {
            parent = reportSellCount.iceCream002Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream002Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream002ValuePCS2.value = reportCountObject.iceCream002PCS2Sell;
        if (reportSellCount.iceCream002ValuePCS2.value > 0) {
            parent = reportSellCount.iceCream002ValuePCS2.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream002ValuePCS2.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream002ValuePCS3.value = reportCountObject.iceCream002PCS3Sell;
        if (reportSellCount.iceCream002ValuePCS3.value > 0) {
            parent = reportSellCount.iceCream002ValuePCS3.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream002ValuePCS3.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream003Value.value = reportCountObject.iceCream003Sell;
        if (reportSellCount.iceCream003Value.value > 0) {
            parent = reportSellCount.iceCream003Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream003Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream003ValuePCS2.value = reportCountObject.iceCream003PCS2Sell;
        if (reportSellCount.iceCream003ValuePCS2.value > 0) {
            parent = reportSellCount.iceCream003ValuePCS2.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream003ValuePCS2.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream003ValuePCS3.value = reportCountObject.iceCream003PCS3Sell;
        if (reportSellCount.iceCream003ValuePCS3.value > 0) {
            parent = reportSellCount.iceCream003ValuePCS3.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream003ValuePCS3.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream004Value.value = reportCountObject.iceCream004Sell;
        if (reportSellCount.iceCream004Value.value > 0) {
            parent = reportSellCount.iceCream004Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream004Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream004ValuePCS2.value = reportCountObject.iceCream004PCS2Sell;
        if (reportSellCount.iceCream004ValuePCS2.value > 0) {
            parent = reportSellCount.iceCream004ValuePCS2.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream004ValuePCS2.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.iceCream004ValuePCS3.value = reportCountObject.iceCream004PCS3Sell;
        if (reportSellCount.iceCream004ValuePCS3.value > 0) {
            parent = reportSellCount.iceCream004ValuePCS3.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.iceCream004ValuePCS3.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle001Value.value = reportCountObject.waffle001Sell;
        if (reportSellCount.waffle001Value.value > 0) {
            parent = reportSellCount.waffle001Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle001Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle002Value.value = reportCountObject.waffle002Sell;
        if (reportSellCount.waffle002Value.value > 0) {
            parent = reportSellCount.waffle002Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle002Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle003Value.value = reportCountObject.waffle003Sell;
        if (reportSellCount.waffle003Value.value > 0) {
            parent = reportSellCount.waffle003Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle003Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle004Value.value = reportCountObject.waffle004Sell;
        if (reportSellCount.waffle004Value.value > 0) {
            parent = reportSellCount.waffle004Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle004Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle005Value.value = reportCountObject.waffle005Sell;
        if (reportSellCount.waffle005Value.value > 0) {
            parent = reportSellCount.waffle005Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle005Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle006Value.value = reportCountObject.waffle006Sell;
        if (reportSellCount.waffle006Value.value > 0) {
            parent = reportSellCount.waffle006Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle006Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle007Value.value = reportCountObject.waffle007Sell;
        if (reportSellCount.waffle007Value.value > 0) {
            parent = reportSellCount.waffle007Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle007Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle008Value.value = reportCountObject.waffle008Sell;
        if (reportSellCount.waffle008Value.value > 0) {
            parent = reportSellCount.waffle008Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle008Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle009Value.value = reportCountObject.waffle009Sell;
        if (reportSellCount.waffle009Value.value > 0) {
            parent = reportSellCount.waffle009Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle009Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle0091Value.value = reportCountObject.waffle0091Sell;
        if (reportSellCount.waffle0091Value.value > 0) {
            parent = reportSellCount.waffle0091Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle0091Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle010Value.value = reportCountObject.waffle010Sell;
        if (reportSellCount.waffle010Value.value > 0) {
            parent = reportSellCount.waffle010Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle010Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle0101Value.value = reportCountObject.waffle0101Sell;
        if (reportSellCount.waffle0101Value.value > 0) {
            parent = reportSellCount.waffle0101Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle0101Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle011Value.value = reportCountObject.waffle011Sell;
        if (reportSellCount.waffle011Value.value > 0) {
            parent = reportSellCount.waffle011Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle011Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle012Value.value = reportCountObject.waffle012Sell;
        if (reportSellCount.waffle012Value.value > 0) {
            parent = reportSellCount.waffle012Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle012Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle013Value.value = reportCountObject.waffle013Sell;
        if (reportSellCount.waffle013Value.value > 0) {
            parent = reportSellCount.waffle013Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle013Value.closest(".report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle014Value.value = reportCountObject.waffle014Sell;
        if (reportSellCount.waffle014Value.value > 0) {
            parent = reportSellCount.waffle014Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle014Value.closest("report__all");
            parent.classList.add("active");
        }
        reportSellCount.waffle015Value.value = reportCountObject.waffle015Sell;
        if (reportSellCount.waffle015Value.value > 0) {
            console.log("zhopa");
            parent = reportSellCount.waffle015Value.closest(".all-report__item");
            parent.classList.add("active");
            parent = reportSellCount.waffle015Value.closest(".report__all");
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
            iceCream002: 0,
            iceCream003: 0,
            iceCream004: 0,
            waffle001: 0,
            waffle002: 0,
            waffle003: 0,
            waffle004: 0,
            waffle005: 0,
            waffle006: 0,
            waffle007: 0,
            waffle008: 0,
            waffle009: 0,
            waffle0091: 0,
            waffle010: 0,
            waffle0101: 0,
            waffle011: 0,
            waffle012: 0,
            waffle013: 0,
            waffle014: 0,
            waffle015: 0,
            espressoSell: 0,
            americanoSell: 0,
            dopioSell: 0,
            kapucinoSSell: 0,
            kapucinoMSell: 0,
            kapucinoLSell: 0,
            latteSSell: 0,
            latteMSell: 0,
            latteLSell: 0,
            rafSSell: 0,
            rafMSell: 0,
            fletWhiteSSell: 0,
            fletWhiteMSell: 0,
            creamSell: 0,
            syrupSell: 0,
            milkSell: 0,
            vegetableMilkSell: 0,
            lactoseFreeMilkSell: 0,
            peanutSell: 0,
            coconutShavingsSell: 0,
            marshmellowSell: 0,
            oreoCoffeSell: 0,
            lionCoffeSell: 0,
            bananaCoffeSell: 0,
            coconutCoffeSell: 0,
            kendyNutCoffeSell: 0,
            mmsCoffeSell: 0,
            cherryCoffeSell: 0,
            glyaseCoffeSell: 0,
            kakaoRainbowCoffeSell: 0,
            coldLatteSell: 0,
            tigerLatteSell: 0,
            fruitMexicanSell: 0,
            teeSell: 0,
            ekoTeeSell: 0,
            chokolateSell: 0,
            chokolatePlusSell: 0,
            mulledWineSell: 0,
            cacaoNaturalSell: 0,
            nesquikSSell: 0,
            nesquikMSell: 0,
            matchaSell: 0,
            matchaLatteSell: 0,
            kapucinoSLactoseFreeSell: 0,
            kapucinoMLactoseFreeSell: 0,
            kapucinoLLactoseFreeSell: 0,
            latteSLactoseFreeSell: 0,
            latteMLactoseFreeSell: 0,
            latteLLactoseFreeSell: 0,
            nesquikSLactoseFreeSell: 0,
            cacaoNaturalLactoseFreeSell: 0,
            fletWhiteSLactoseFreeSell: 0,
            kapucinoSVegetableSell: 0,
            kapucinoMVegetableSell: 0,
            latteSVegetableSell: 0,
            latteMVegetableSell: 0,
            cacaoNaturalVegetableSell: 0,
            fletWhiteSVegetableSell: 0,
            jarIceCreamSell: 0,
            jarSorbetSell: 0,
            iceCream001Sell: 0,
            iceCream001PCS2Sell: 0,
            iceCream001PCS3Sell: 0,
            iceCream002Sell: 0,
            iceCream002PCS2Sell: 0,
            iceCream002PCS3Sell: 0,
            iceCream003Sell: 0,
            iceCream003PCS2Sell: 0,
            iceCream003PCS3Sell: 0,
            iceCream004Sell: 0,
            iceCream004PCS2Sell: 0,
            iceCream004PCS3Sell: 0,
            waffle001Sell: 0,
            waffle002Sell: 0,
            waffle003Sell: 0,
            waffle004Sell: 0,
            waffle005Sell: 0,
            waffle006Sell: 0,
            waffle007Sell: 0,
            waffle008Sell: 0,
            waffle009Sell: 0,
            waffle0091Sell: 0,
            waffle010Sell: 0,
            waffle0101Sell: 0,
            waffle011Sell: 0,
            waffle012Sell: 0,
            waffle013Sell: 0,
            waffle014Sell: 0,
            waffle015Sell: 0
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