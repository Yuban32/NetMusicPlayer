<template>
    <div class="loading-wrap">
        <span class="loader"><span class="loader-inner"></span></span>
    </div>
</template>

<style scoped>
    .loading-wrap{
        width: 100vw!important;
        height: 100% !important;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.521);
        z-index: 9999;
    }
    .loader {
        display: inline-block;
        width: 30px;
        text-align: center;
        height: 30px;
        position: relative;
        border: 4px solid #Fff;
        top: 50%;
        animation: loader 2s infinite ease;
    }

    .loader-inner {
        vertical-align: top;
        display: inline-block;
        width: 100%;
        background-color: #fff;
        animation: loader-inner 2s infinite ease-in;
    }

    @keyframes loader {
        0% {
            transform: rotate(0deg);
        }

        25% {
            transform: rotate(180deg);
        }

        50% {
            transform: rotate(180deg);
        }

        75% {
            transform: rotate(360deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes loader-inner {
        0% {
            height: 0%;
        }

        25% {
            height: 0%;
        }

        50% {
            height: 100%;
        }

        75% {
            height: 100%;
        }

        100% {
            height: 0%;
        }
    }
</style>