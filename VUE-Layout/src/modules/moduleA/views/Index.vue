<template>
    <el-container>
        <el-header>
            <Header :activeIndex="activeIndex" @handleTab="handleTab"></Header>
        </el-header>
        <!-- <el-container> -->
            <!-- <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main> -->
            <div ref='currentTabs' :is="currentTab"></div>
        <!-- </el-container> -->
        <el-footer>
            <Footer></Footer>
        </el-footer>
    </el-container>
</template>
<script>
import Header from '../../../assets/components/Header';
import Footer from '../../../assets/components/Footer';

import TabA from './TabA';
import TabB_1 from './TabB_1';
import TabB_2 from './TabB_2';
import TabB_3 from './TabB_3';
import TabC from './TabC';
import TabD from './TabD';
import TabE from './TabE';

export default {
    components: {
        Header,
        Footer,
        TabA,
        TabB_1,
        TabB_2,
        TabB_3,
        TabC,
        TabD,
        TabE
    },
    data() {
        return {
            activeIndex: '1',
            currentTab: 'TabA'
        };
    },
    watch: {
        'activeIndex': {
            handler(val) {
                debugger
                console.log('-------' + val);
            }
        }
    },
    methods: {
        handleTab(key, keyPath) {
            debugger
            switch(key) {
                case '1':
                    this.currentTab = 'TabA';
                    break;
                case '2':
                    this.currentTab = 'TabB';
                    break;
                case '2-1':
                    this.currentTab = 'TabB_1';
                    break;
                case '2-2':
                    this.currentTab = 'TabB_2';
                    break;
                case '2-3':
                    this.currentTab = 'TabB_3';
                    break;
                case '3':
                    this.currentTab = 'TabC';
                    break;
                case '3-1':
                    break;
                case '3-2':
                    break;
                case '3-3':
                    break;
                case '4':
                    this.currentTab = 'TabD';
                    break;
                case '5':
                    this.currentTab = 'TabE';
                    break;
            }

            this.$nextTick(function() {
                this.$refs.currentTabs.init();
            })
        }
    }
}
</script>
<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 80px;
    }

    .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 80px;
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        height: auto;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        height: auto;
    }

    body>.el-container {
        margin-bottom: 40px;
        height: auto;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }
</style>