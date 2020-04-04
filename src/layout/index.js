import { Component } from "react";
import { Layout, Icon, ConfigProvider } from "antd";
import SiderMenu from "../component/SiderMenu/SiderMenu";
import { getMenuData } from "../common/menu";
import logo from "../assets/logo.svg";
import GlobalHeader from "../component/GlobalHeader";
import GlobalFooter from "../component/GlobalFooter";
import zh_CN from "antd/lib/locale-provider/zh_CN";

const { Content, Header } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;
    return (
      <ConfigProvider locale={zh_CN}>
        <Layout>
          <SiderMenu
            logo={logo}
            collapsed={collapsed}
            menuData={getMenuData()}
            location={location}
            onCollapse={this.handleMenuCollapse}
          />
          <Layout>
            <Header style={{ padding: 0 }}>
              <GlobalHeader
                logo={logo}
                collapsed={collapsed}
                currentUser={{
                  name: "Serati Ma",
                  avatar:
                    "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
                  userid: "00000001",
                  notifyCount: 12
                }}
                onCollapse={this.handleMenuCollapse}
              />
            </Header>
            <Content style={{ margin: "0 0", height: "100%", backgroundColor: "white",}}>
              {children}
            </Content>
            <GlobalFooter

              links={[
                {
                  key:"footer",
                  title: "Ant-Design",
                  href: "https://ant.design/index-cn",
                  blankTarget: true
                }
              ]}
              copyright={
                <span>
                  Copyright <Icon type="copyright" /> 2018 lewis
                </span>
              }
            />
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default BasicLayout;
