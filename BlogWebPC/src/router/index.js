import Vue from 'vue'
import Router from 'vue-router'
import BlogList from '@components/blog/BlogList';
import MyBlogList from '@components/blog/MyBlogList';
import CommentManger from '@components/blog/CommentManger';
import ReleaseBlog from '@components/blog/ReleaseBlog';
import Personal from '@components/user/Personal';
import Settings from '@components/user/Settings';
import Blog from '@components/blog/BlogLister';
import Edit from '@components/user/MyBlogEdit';
import BlogType from '@components/blog/BlogType';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'BlogList',
            component: BlogList
        }, {
            path: '/MyBlogList',
            name: 'MyBlogList',
            component: MyBlogList
        }, {
            path: '/Personal',
            name: 'Personal',
            component: Personal
        }, {
            path: '/ReleaseBlog',
            name: 'ReleaseBlog',
            component: ReleaseBlog
        }, {
            path: '/CommentManger',
            name: 'CommentManger',
            component: CommentManger
        }, {
            path: '/Settings',
            name: 'Settings',
            component: Settings
        },
        {
            path: '/Blog',
            name: 'BlogLister',
            component: Blog
        },
        {
            path: '/Edit',
            name: 'MyBlogEdit',
            component: Edit
        },
        {
            path: '/BlogType',
            name: 'BlogType',
            component: BlogType
        }
    ]
});
