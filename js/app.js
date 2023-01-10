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
                    } else if (value < 1) value = 0;
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
    var espressoPrice = 19;
    var americanoPrice = 19;
    var dopioPrice = 33;
    var kapucinoSPrice = 30;
    var kapucinoMPrice = 37;
    var kapucinoLPrice = 43;
    var latteSPrice = 30;
    var latteMPrice = 37;
    var latteLPrice = 43;
    var rafSPrice = 43;
    var rafMPrice = 50;
    var fletWhiteSPrice = 35;
    var fletWhiteMPrice = 43;
    var creamPrice = 6;
    var syrupPrice = 6;
    var milkPrice = 6;
    var vegetableMilkPrice = 14;
    var lactoseFreeMilkPrice = 10;
    var espressoCount = Number();
    var americanoCount = Number();
    var dopioCount = Number();
    var kapucinoSCount = Number();
    var kapucinoMCount = Number();
    var kapucinoLCount = Number();
    var latteSCount = Number();
    var latteMCount = Number();
    var latteLCount = Number();
    var rafSCount = Number();
    var rafMCount = Number();
    var fletWhiteSCount = Number();
    var fletWhiteMCount = Number();
    var creamCount = Number();
    var syrupCount = Number();
    var milkCount = Number();
    var vegetableMilkCount = Number();
    var lactoseFreeMilkCount = Number();
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
    function chekCalc() {
        chekSumm = 0;
        chekSumm = espressoSumm + americanoSumm + dopioSumm + kapucinoSSumm + kapucinoMSumm + kapucinoLSumm + latteSSumm + latteMSumm + latteLSumm + rafSSumm + rafMSumm + fletWhiteSSumm + fletWhiteMSumm + creamSumm + syrupSumm + milkSumm + vegetableMilkSumm + lactoseFreeMilkSumm;
        chek.value = chekSumm;
    }
    function espresso() {
        espressoCount = document.getElementById("espresso").value;
        espressoSumm = espressoCount * espressoPrice;
        chekCalc();
    }
    espressoButton.addEventListener("click", espresso);
    function americano() {
        americanoCount = document.getElementById("americano").value;
        americanoSumm = americanoCount * americanoPrice;
        chekCalc();
    }
    americanoButton.addEventListener("click", americano);
    function dopio() {
        dopioCount = document.getElementById("dopio").value;
        dopioSumm = dopioCount * dopioPrice;
        chekCalc();
    }
    dopioButton.addEventListener("click", dopio);
    function kapucinoS() {
        kapucinoSCount = document.getElementById("kapucinoS").value;
        kapucinoSSumm = kapucinoSCount * kapucinoSPrice;
        chekCalc();
    }
    kapucinoSButton.addEventListener("click", kapucinoS);
    function kapucinoM() {
        kapucinoMCount = document.getElementById("kapucinoM").value;
        kapucinoMSumm = kapucinoMCount * kapucinoMPrice;
        chekCalc();
    }
    kapucinoMButton.addEventListener("click", kapucinoM);
    function kapucinoL() {
        kapucinoLCount = document.getElementById("kapucinoL").value;
        kapucinoLSumm = kapucinoLCount * kapucinoLPrice;
        chekCalc();
    }
    kapucinoLButton.addEventListener("click", kapucinoL);
    function latteS() {
        latteSCount = document.getElementById("latteS").value;
        latteSSumm = latteSCount * latteSPrice;
        chekCalc();
    }
    latteSButton.addEventListener("click", latteS);
    function latteM() {
        latteMCount = document.getElementById("latteM").value;
        latteMSumm = latteMCount * latteMPrice;
        chekCalc();
    }
    latteMButton.addEventListener("click", latteM);
    function latteL() {
        latteLCount = document.getElementById("latteL").value;
        latteLSumm = latteLCount * latteLPrice;
        chekCalc();
    }
    latteLButton.addEventListener("click", latteL);
    function rafS() {
        rafSCount = document.getElementById("rafS").value;
        rafSSumm = rafSCount * rafSPrice;
        chekCalc();
    }
    rafSButton.addEventListener("click", rafS);
    function rafM() {
        rafMCount = document.getElementById("rafM").value;
        rafMSumm = rafMCount * rafMPrice;
        chekCalc();
    }
    rafMButton.addEventListener("click", rafM);
    function fletWhiteS() {
        fletWhiteSCount = document.getElementById("fletWhiteS").value;
        fletWhiteSSumm = fletWhiteSCount * fletWhiteSPrice;
        chekCalc();
    }
    fletWhiteSButton.addEventListener("click", fletWhiteS);
    function fletWhiteM() {
        fletWhiteMCount = document.getElementById("fletWhiteM").value;
        fletWhiteMSumm = fletWhiteMCount * fletWhiteMPrice;
        chekCalc();
    }
    fletWhiteMButton.addEventListener("click", fletWhiteM);
    function cream() {
        creamCount = document.getElementById("cream").value;
        creamSumm = creamCount * creamPrice;
        chekCalc();
    }
    creamButton.addEventListener("click", cream);
    function syrup() {
        syrupCount = document.getElementById("syrup").value;
        syrupSumm = syrupCount * syrupPrice;
        chekCalc();
    }
    syrupButton.addEventListener("click", syrup);
    function milk() {
        milkCount = document.getElementById("milk").value;
        milkSumm = milkCount * milkPrice;
        chekCalc();
    }
    milkButton.addEventListener("click", milk);
    function vegetableMilk() {
        vegetableMilkCount = document.getElementById("vegetableMilk").value;
        vegetableMilkSumm = vegetableMilkCount * vegetableMilkPrice;
        chekCalc();
    }
    vegetableMilkButton.addEventListener("click", vegetableMilk);
    function lactoseFreeMilk() {
        lactoseFreeMilkCount = document.getElementById("lactoseFreeMilk").value;
        lactoseFreeMilkSumm = lactoseFreeMilkCount * lactoseFreeMilkPrice;
        chekCalc();
    }
    lactoseFreeMilkButton.addEventListener("click", lactoseFreeMilk);
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
        lactoseFreeMilk: Number()
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
        americanoSumm = americanoCount = document.getElementById("americano").value = 0;
        espressoSumm = espressoCount = document.getElementById("espresso").value = 0;
        dopioSumm = dopioCount = document.getElementById("dopio").value = 0;
        kapucinoSSumm = kapucinoSCount = document.getElementById("kapucinoS").value = 0;
        kapucinoMSumm = kapucinoMCount = document.getElementById("kapucinoM").value = 0;
        kapucinoLSumm = kapucinoLCount = document.getElementById("kapucinoL").value = 0;
        latteSSumm = latteSCount = document.getElementById("latteS").value = 0;
        latteMSumm = latteMCount = document.getElementById("latteM").value = 0;
        latteLSumm = latteLCount = document.getElementById("latteL").value = 0;
        rafSSumm = rafSCount = document.getElementById("rafS").value = 0;
        rafMSumm = rafMCount = document.getElementById("rafM").value = 0;
        fletWhiteSSumm = fletWhiteSCount = document.getElementById("fletWhiteS").value = 0;
        fletWhiteMSumm = fletWhiteMCount = document.getElementById("fletWhiteM").value = 0;
        creamSumm = creamCount = document.getElementById("cream").value = 0;
        syrupSumm = syrupCount = document.getElementById("syrup").value = 0;
        milkSumm = milkCount = document.getElementById("milk").value = 0;
        vegetableMilkSumm = vegetableMilkCount = document.getElementById("vegetableMilk").value = 0;
        lactoseFreeMilkSumm = lactoseFreeMilkCount = document.getElementById("lactoseFreeMilk").value = 0;
        chek.value = chekSumm = 0;
        document.getElementById("beforeMoney").value = "";
    }
    function beforeMoneyFoo() {
        beforeMoneyValue = document.getElementById("beforeMoney").value;
        summ.allSumm = summ.allSumm + +beforeMoneyValue;
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
            espresso: reportCountObject.espresso + +espressoCount,
            americano: reportCountObject.americano + +americanoCount,
            dopio: reportCountObject.dopio + +dopioCount,
            kapucinoS: reportCountObject.kapucinoS + +kapucinoSCount,
            kapucinoM: reportCountObject.kapucinoM + +kapucinoMCount,
            kapucinoL: reportCountObject.kapucinoL + +kapucinoLCount,
            latteS: reportCountObject.latteS + +latteSCount,
            latteM: reportCountObject.latteM + +latteMCount,
            latteL: reportCountObject.latteL + +latteLCount,
            rafS: reportCountObject.rafS + +rafSCount,
            rafM: reportCountObject.rafM + +rafMCount,
            fletWhiteS: reportCountObject.fletWhiteS + +fletWhiteSCount,
            fletWhiteM: reportCountObject.fletWhiteM + +fletWhiteMCount,
            cream: reportCountObject.cream + +creamCount,
            syrup: reportCountObject.syrup + +syrupCount,
            milk: reportCountObject.milk + +milkCount,
            vegetableMilk: reportCountObject.vegetableMilk + +vegetableMilkCount,
            lactoseFreeMilk: reportCountObject.lactoseFreeMilk + +lactoseFreeMilkCount
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
            lactoseFreeMilk: 0
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