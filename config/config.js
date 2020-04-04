export default {
  singular: true,
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: true,
        dva: true,
        locale: {
          enable: true
        }
      }
    ]
  ],
  routes: [
    {
      path: "/",
      component: "../layout",
      routes: [
        {
          path: "/",
          component: "./org-manage"
        },
        {
          path: "org-manage",
          component: "./org-manage"
        },
        {
          path: "role-manage",
          component: "./role-manage"
        },
        {
          path: "role-config",
          component: "./role-config"
        },
        {
          path: "menu-setting",
          component: "./menu-setting"
        },
        {
          path: "data-permission-setting",
          component: "./data-setting"
        },
        {
          path: "function-permission-setting",
          component: "./func-setting"
        },
      ]
    }
  ],
  proxy: {
    "/dev": {
      target: "https://08ad1pao69.execute-api.us-east-1.amazonaws.com",
      changeOrigin: true
    },
    "/test": {
      target:"http://127.0.0.1:8081/api/v1/sop/",
      changeOrigin:true
    },
    "/proxy": {
      // "target": "http://service-zhyypro.oennso.enn.cn/api/v1/sop/", // 生产服务
      // "target": "http://promotion-service-pre-zhyytest.oennso.enn.cn/api/v1/sop/", // 预生产服务
      // "target": "http://promotion-service13-pre-zhyytest.oennso.enn.cn/api/v1/sop/", // 新预生产服务
      // "target": "http://promotion-service-zhyytest.oennso.enn.cn/api/v1/sop/", // 推广服务
      // "target": "http://promotion-service-dev-zhyytest.oennso.enn.cn/api/v1/sop/", // 开发服务
      // "target": 'http://10.39.0.36:8081/api/v1/sop/', // 后台连调节口
      // "target": "http://emer-service-zhyytest.oennso.enn.cn/api/v1/sop/", // 应急单独服务
      // "target": "http://localhost:8081/api/v1/sop/", // 本地服务
      "changeOrigin": true,
      "pathRewrite": { "^/proxy": "" }
    },
  }
};
