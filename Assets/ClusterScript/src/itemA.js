import { Hello } from "./modules/hello";

// 起動時に実行される
$.onStart(() => {
    const hello = new Hello("A Hello");
    hello.log('World'); 
});