import { createRouter, createWebHistory } from "vue-router";
import Log from '../components/login.vue';
import LogOut from '../components/logout.vue';
import Admin from '../components/adminboard.vue';
import Student from '../components/studentboard.vue';
import Teacher from '../components/teacherboard.vue';
import List from '../components/itemlist.vue';
import Home from '../components/home.vue';
import Detail from '../components/itemdetail.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Log },
        { path: '/:path/:id', component: Detail},

        {
            path: '/admin', component: Admin,
            children: [
                { path: '', component: Home },
                { path: 'messaging', component: List },
                { path: 'course_managing', component: List },
                { path: 'user_managing', component: List },
                { path: 'logout', component: LogOut },
                { path: ':pathMatch(.*)*', redirect: '/login' }
            ],
        },
        {
            path: '/student', component: Student,
            children: [
                { path: '', component: Home },
                { path: 'messaging', component: List },
                { path: 'course_selection', component: List },
                { path: 'logout', component: LogOut },
            ],
        },
        {
            path: '/teacher', component: Teacher,
            children: [
                { path: '', component: Home },
                { path: 'messaging', component: List },
                { path: 'course_managing', component: List },
                { path: 'logout', component: LogOut },
            ],
        },
        // Global route to redirect invalid URLs to '/login'
        // Use already defined token to automatically connect to the right board
        { path: '/:pathMatch(.*)*', redirect: '/login'},
        { path: '/teacher/:pathMatch(.*)*', redirect: '/login'},
        { path: '/admin/:pathMatch(.*)*', redirect: '/login'},
        { path: '/student/:pathMatch(.*)*', redirect: '/login'},
    ]
});

export default router;