import { Component, OnInit } from '@angular/core';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { AppComponentBase } from '@shared/app-component-base';
import { Injector } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { SettingsService, TitleService, MenuService, Menu } from '@delon/theme';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HostBinding } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { AppConsts } from '@shared/AppConsts';
import { MenuItem } from '@shared/layout/menu-item';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  host: {
    '[class.alain-default]': 'true',
  },
})
export class AppComponent extends AppComponentBase
  implements OnInit, AfterViewInit {
  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.fixed;
  }
  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  // 全局的菜单
  Menums = [
    // 首页
    new MenuItem(this.l('HomePage'), '', 'anticon anticon-home', '/app/home'),
    // 租户
    new MenuItem(
      this.l('Tenants'),
      'Pages.Tenants',
      'anticon anticon-team',
      '/app/tenants',
    ),
    new MenuItem('管理', 'Pages.Administration', 'anticon anticon-appstore-o', '', [
      // 角色
      new MenuItem(this.l('Roles'), 'Pages.Administration.Roles', 'anticon anticon-safety', '/app/admin/roles'),
      // 用户
      new MenuItem(this.l('Users'), 'Pages.Administration.Users', 'anticon anticon-user', '/app/admin/users'),
      new MenuItem('用户组', 'Pages.Administration.Users', 'anticon anticon-usergroup-add', '/app/admin/group'),
      new MenuItem(this.l('OrganizationUnits'), 'Pages.Administration.OrganizationUnits', 'anticon anticon-book', '/app/admin/organization'),
      new MenuItem(this.l('AuditLogs'), 'Pages.Administration.AuditLogs', 'anticon anticon-setting', '/app/admin/auditLogs'),
    ]),
    new MenuItem('基本信息维护', 'Pages.BasInfo', 'anticon anticon-tag-o', '', [
      new MenuItem('站点管理', 'Pages.BasInfo.StationManage', 'anticon anticon-tag-o', '/app/baseinfo/station'),
      //线路站点管理
      new MenuItem('线路管理', 'Pages.BasInfo.StationManage', 'anticon anticon-tag-o', '/app/baseinfo/line'),
      new MenuItem('逻辑线路/站点管理', 'Pages.BasInfo.LogicLineManage', 'anticon anticon-tag-o', '/app/baseinfo/logicline')
    ]),
    new MenuItem('业务管理', 'Pages.Business', 'anticon anticon-tag-o', '', [
      new MenuItem('时刻表管理', 'Pages.Business.TableInfo', 'anticon anticon-tag-o', '/app/business/tb')
    ])
  ];

  constructor(
    injector: Injector,
    private settings: SettingsService,
    private router: Router,
    private titleSrv: TitleService,
    private menuService: MenuService,
  ) {
    super(injector);

    // 创建菜单

    const arrMenu = new Array<Menu>();
    this.processMenu(arrMenu, this.Menums);
    this.menuService.add(arrMenu);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => this.titleSrv.setTitle());

    // 注册通知信息
    // SignalRAspNetCoreHelper.initSignalR();
    // 触发通知事件
    // abp.event.on('abp.notifications.received', userNotification => {
    //   abp.notifications.showUiNotifyForUserNotification(userNotification);

    //   // Desktop notification
    //   Push.create('AbpZeroTemplate', {
    //     body: userNotification.notification.data.message,
    //     icon: abp.appPath + 'assets/app-logo-small.png',
    //     timeout: 6000,
    //     onClick: function () {
    //       window.focus();
    //       this.close();
    //     },
    //   });
    // });
  }

  ngAfterViewInit(): void {
    // ($ as any).AdminBSB.activateAll();
    // ($ as any).AdminBSB.activateDemo();
  }

  // 处理生成菜单
  processMenu(resMenu: Menu[], menus: MenuItem[], isChild?: boolean) {
    menus.forEach(item => {
      let subMenu: Menu;
      subMenu = {
        text: item.displayName,
        link: item.route,
        icon: `${item.icon}`,
        hide: item.hide,
      };
      if (item.permission !== '' && !this.isGranted(item.permission)) {
        subMenu.hide = true;
      }

      if (item.childMenus && item.childMenus.length > 0) {
        subMenu.children = [];
        this.processMenu(subMenu.children, item.childMenus);
      }

      resMenu.push(subMenu);
    });
  }
}
