import { Hello } from "./modules/hello";

// インタラクトイベント時に実行される
$.onInteract(() => {
    const hello = new Hello("B Hello");
    hello.log('World'); 
});