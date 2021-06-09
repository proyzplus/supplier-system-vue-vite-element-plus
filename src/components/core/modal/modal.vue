<template>
    <transition :enter-active-class="enter_active_class" :leave-active-class="leave_active_class" v-if="isShow_modal">
        <section :class="{modal_modal:true,isOverlay:isOverlay}" v-if="isShow_modal" ref="modal"
                 @click="close_on_click_overlay?isShow_modal=false:''"
                 :style="{background:overlay_background}">
            <section class="outside">
                <main class="main" @click.stop="" :style="{top}">
                    <div class="content" :style="{borderRadius:radius,width}">
                        <header class="header" v-if="show_header">
                            <p class="title"><span v-if="show_title">{{title}}</span></p>
                            <div class="icon" @click="isShow_modal=false" v-if="show_close">
                                <icon name="Icon_Icon_iconfont-chahao"></icon>
                            </div>
                        </header>
                        <section class="slot">
                            <slot></slot>
                        </section>
                    </div>
                </main>
            </section>
        </section>
    </transition>
</template>

<script>

    // esc按键事件有bug,当场景为嵌套多个弹框的时候,按下esc键会关闭全部弹框

    export default {
        name: "modal",
        methods: {
            async keydown_event(event) {
                const config = {
                    isScroll: this.isScroll,
                    isShow: this.isShow,
                    Escape: 27,
                };
                // 按下Esc键
                if (config.isShow && event.keyCode === config.Escape) {
                    this.isShow_modal = false;
                }
            },
            async applyConfig(isShow = this.isShow_modal) {
                const config = {
                    isScroll: this.isScroll,
                    isShow,
                    Escape: 27,
                };

                const run = () => {

                    const body_dom = document.body.style;
                    const modal_modal_dom = document.querySelectorAll(".modal_modal");

                    if (body_dom.overflow === "hidden" && modal_modal_dom.length === 0) {
                        body_dom.overflow = "initial";
                    } else {
                        if (config.isShow && !config.isScroll && modal_modal_dom.length !== 0) {
                            body_dom.overflow = "hidden";
                        }
                    }

                };

                this.$nextTick(() => {
                    run();
                });
            }
        },
        beforeDestroy() {
            this.$nextTick(() => {
                window.removeEventListener("keydown", this.keydown_event);
            });
        },
        mounted() {
            this.$nextTick(() => {
                this.isShow_modal = this.isShow;
            });
        },
        watch: {
            isShow: function (val) {
                this.isShow_modal = val;
            },
            isShow_modal: function (val) {
                const run = async () => {
                    this.$emit("update:isShow", val);
                    this.applyConfig();
                    val && this.close_on_press_escape ? window.addEventListener("keydown", this.keydown_event)
                        : window.removeEventListener("keydown", this.keydown_event);
                };

                // 如果before_close有值
                // 且当前为准备关闭弹框阶段
                if (!val && this.before_close) {

                    this.before_close()
                        .then((res) => {
                            // 返回true 可以 关闭弹框
                            // 否则不能关闭
                            if (!res) {
                                this.isShow_modal = true;
                                this.$emit("update:isShow", true);
                            } else {
                                run();
                            }
                        });

                } else {
                    run();
                }
            }
        },
        data() {
            return {
                isShow_modal: false
            }
        },
        props: {
            isShow: [Boolean],
            isOverlay: {
                type: Boolean,
                default: true
            },
            isScroll: {
                type: Boolean,
                default: false
            },
            radius: {
                type: String,
                default: "0.2rem"
            },
            title: [String],
            width: [String],
            close_on_click_overlay: {
                type: Boolean,
                default: true
            },
            close_on_press_escape: {
                type: Boolean,
                default: true
            },
            show_close: {
                type: Boolean,
                default: true
            },
            show_title: {
                type: Boolean,
                default: true
            },
            show_header: {
                type: Boolean,
                default: true
            },
            before_close: {
                type: Function
            },
            top: [String],
            enter_active_class: {
                type: String,
                default: "animated fadeIn"
            },
            leave_active_class: {
                type: String,
                default: "animated fadeOut"
            },
            overlay_background: [String]
        }
    }
</script>

<style lang="less" scoped>

    .isOverlay {
        background: rgba(0, 0, 0, 0.6);
    }

    .modal_modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        .outside {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            .main {
                position: relative;
                background-color: inherit;
                display: flex;
                justify-content: center;
                max-height: 100%;
                .content {
                    background-color: white;
                    padding: 1rem 0;
                    min-width: 30rem;
                    min-height: 15rem;
                    max-width: 100vw;
                    box-shadow: 0 0 3px 0 white;
                    word-break: break-all;
                    box-sizing: border-box;
                    .header {
                        display: flex;
                        align-items: center;
                        padding: 0 1rem;
                        margin-bottom: 1rem;
                        .title {
                            flex: 1;
                            font-size: larger;
                        }
                        .icon {
                            &:hover {
                                cursor: pointer;
                            }
                        }
                    }
                    .slot {
                        position: relative;
                        padding: 0 1rem;
                        overflow: auto;
                        height: 100%;
                    }
                }
            }
        }
    }

</style>