<template>
    <div class="Icon_Icon">
        <svg class="Icon_Icon_iconfont" aria-hidden="true">
            <use :xlink:href="'#'+name"></use>
        </svg>
    </div>
</template>

<script>
    import "../../../assets/icon/iconfont/index";

    export default {
        name: "icon",
        props: {
            name: {
                type: String
            }
        }
    }
</script>

<style lang="less" scoped>

    .Icon_Icon {
        position: relative;
    }

    .Icon_Icon_iconfont {
        width: 18px;
        height: 1.5em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        cursor:pointer;
    }

</style>