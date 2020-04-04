import React from 'react';
import { Link } from 'dva/router';
import PageHeader from '../component/PageHeader';
import styles from './PageHeaderLayout.less';

export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div className={wrapperClassName}>
    {top}
    <PageHeader {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
