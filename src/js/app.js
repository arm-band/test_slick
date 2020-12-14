/**
 * addSlick
 *
 * 引数で渡された jQueryオブジェクト で Slick を開始する
 *
 * @param {object} $jqueryDom
 */
const addSlick = ($jqueryDom) => {
    $jqueryDom.slick({
        autoplay: true,
        dots: false,
        autoplaySpeed: 3000,
        lazyLoad: 'ondemand',
        prevArrow:
            '<div class="slide_arrow slide_arrowLeft"><i class="fa fa-fw fa-3x fa-chevron-left" aria-hidden="true"></i></div>',
        nextArrow:
            '<div class="slide_arrow slide_arrowRight"><i class="fa fa-fw fa-3x fa-chevron-right" aria-hidden="true"></i></div>',
    });
    $jqueryDom.on({
        mouseenter: function () {
            $(this).addClass('arrowShow');
        },
        mouseleave: function () {
            $(this).removeClass('arrowShow');
        },
    });
    console.log('jqueryObject Id: ', $jqueryDom.attr('id'));
};

/**
 * lazyLoad
 *
 * lazyLoad を有効にした Slick を実行する。 lazyLoaded, lazyLoadError イベントの発火と console.log への出力も実行する
 */
const lazyLoad = () => {
    const $lazyLoad = $('#lazyLoad');
    const $lazyLoadLog = $('#lazyLoadLog');
    $lazyLoad.on('lazyLoaded', function (event, slick, image, imageSource) {
        // lazy load succeed
        $lazyLoadLog.text(`${event.type}: ${imageSource} / ${image[0].alt} の読み込みが完了しました。`);
    });
    $lazyLoad.on('lazyLoadError', function (event, slick, image, imageSource) {
        // lazy load failed
        $lazyLoadLog.text(`${event.type}: ${imageSource} の読み込みが失敗しました。`);
    });

    // Slick
    addSlick($lazyLoad);
};

/**
 * setPotion
 *
 * Bootstrap のモーダルを使用して setPosition あり/なしで モーダル内 Slick を実行させる比較のサンプル
 * ※ setPosition ありでも2回目以降は Uncaught TypeError: Cannot read property 'add' of null エラーが発生する
 */
const setPotion = () => {
    // setPosition なしで モーダル内 Slick を実行させる
    const $nonSetPotion = $('#nonSetPotion');
    // Slick
    addSlick($nonSetPotion);

    // setPosition ありで モーダル内 Slick を実行させる
    const $setPotionModalButton = $('#setPotionModalButton');
    $setPotionModalButton.on('click', function () {
        console.log('setPotion clicked!');
        // 0.3s 後に setPosition 付きで Slick 実行
        const slickInit = setTimeout(() => {
            const $setPotion = $('#setPotion');
            // Slick
            addSlick($setPotion);
            $setPotion.slick('setPosition');
            console.log('setPotion triggered setTimeout!');
        }, 300);
    });
};

/**
 * unInitialized
 *
 * setPotion で 2回目以降にエラーになってしまうので slick-initialized の有無を見る
 */
const unInitialized = () => {
    // setPosition ありで モーダル内 Slick を実行させる
    const $unInitializedModalButton = $('#unInitializedModalButton');
    $unInitializedModalButton.on('click', function () {
        console.log('unInitialized clicked!');
        // 0.3s 後に setPosition 付きで Slick 実行
        const slickInit = setTimeout(() => {
            const $unInitialized = $('#unInitialized');
            // Slick
            addSlick($unInitialized.not('.slick-initialized'));
            $unInitialized.slick('setPosition');
            console.log('unInitialized triggered setTimeout!');
        }, 300);
    });
};

/**
 * unSlick
 *
 * setPotion で 2回目以降にエラーになってしまうので slick-initialized の有無を見る + モーダルを閉じる際に unslick でバインドを解除
 */
const unSlick = () => {
    // setPosition ありで モーダル内 Slick を実行させる
    const $unSlickModalButton = $('#unSlickModalButton');
    const unSlickModalID = $unSlickModalButton.attr('data-target');
    const $unSlickModal = $(unSlickModalID);
    const slickInitializedClass = 'slick-initialized';
    $unSlickModalButton.on('click', function () {
        console.log('unSlick clicked!');
        const $unSlick = $('#unSlick');
        // 0.3s 後に setPosition 付きで Slick 実行
        const slickInit = setTimeout(() => {
            // Slick
            addSlick($unSlick.not(`.${slickInitializedClass}`));
            $unSlick.slick('setPosition');
            console.log('unSlick triggered setTimeout!');
        }, 300);
        $unSlickModal.on('hidden.bs.modal', function () {
            // Bootstrap のモーダルを閉じるイベントが発火したら
            if ($unSlick.hasClass(slickInitializedClass)) {
                // Slick 対象要素が slick-initialized クラスを持っていたら
                // unslick で Slick をアンバインド
                $unSlick.slick('unslick');
                console.log('unSlick triggered unslick!');
            }
            // setTimeout 発動前にモーダルを閉じると setTimeout が生き残っているので、すぐまたモーダルを開いたりすると Slick のバインドが2回走ったりしておかしくなるので clearTimeout する
            clearTimeout(slickInit);
            // モーダルを閉じる度に hidden.bs.modal イベントがバインドされて重複処理してしまうので閉じられたらアンバインドする
            $unSlickModal.off('hidden.bs.modal');
            console.log('unSlick triggered hidden.bs.modal!');
        });
    });
};

window.addEventListener('load', () => {
    // lazyLoad を有効にした Slick を実行する。 lazyLoaded, lazyLoadError イベントの発火と console.log への出力も実行する
    lazyLoad();
    // Bootstrap のモーダルを使用して setPosition あり/なしで モーダル内 Slick を実行させる比較のサンプル
    setPotion();
    // setPotion で 2回目以降にエラーになってしまうので slick-initialized の有無を見る
    unInitialized();
    // setPotion で 2回目以降にエラーになってしまうので slick-initialized の有無を見る + モーダルを閉じる際に unslick でバインドを解除
    unSlick();
});
