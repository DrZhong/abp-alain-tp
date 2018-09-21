import { Component, OnInit, Injector } from '@angular/core';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/component-base/paged-listing-component-base';
import {
  RoleDto,
  RoleServiceProxy,
  PagedResultDtoOfRoleDto,
} from '@shared/service-proxies/service-proxies';
import { ArrayService } from '@delon/util';

import { STColumn, STColumnButton, STPage, STChange } from '@delon/abc';
import { rename } from 'fs';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: [],
})
export class RolesComponent extends PagedListingComponentBase<RoleDto> {
  constructor(
    arrayService: ArrayService,
    injector: Injector, private rolesService: RoleServiceProxy) {
    super(injector);
  }
  reName = {};

  show($event: STChange) {
    if ($event.type == "click") return;
    this.pageNumber = $event.pi;
    this.pageSize = $event.ps;
    this.refresh();
  }

  protected fetchData(
    request: PagedRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    this.rolesService
      .getAll(request.skipCount, request.maxResultCount)
      .finally(() => {
        finishedCallback();
      })
      .subscribe((result: PagedResultDtoOfRoleDto) => {
        this.dataList = result.items;
        this.totalItems = result.totalCount;
      });
  }

  page: STPage = {
    front: false,
    pageSizes: [3, 5, 10],
    total: true,
    showSize: true
  };

  columns: STColumn[] = [
    { title: '角色', index: 'name' },
    { title: '角色名称', index: 'displayName' },
    {
      title: '操作区',
      buttons: [
        {
          text: '删除',
          type: 'del',
          click: (record: any) => {
            this.delete(record);
          }
        },
        {
          text: '编辑',
          click: (record: any) => {
            this.createOrUpdate(record)
          }
          //this.edit(record)
        },
        {
          text: '更多',
          children: [
            {
              text: `过期`,
              click: (record: any) =>
                this.message.error(`过期【${record.name}】`),
              format: (record: any) =>
                `<i class="anticon anticon-frown-o"></i> 过期`,
            },
            {
              text: `重新开始`,
              click: (record: any) =>
                this.message.success(`重新开始【${record.name}】`),
            },
          ],
        },
      ],
    },
  ];

  protected delete(entity: RoleDto): void {
    this.rolesService
      .delete(entity.id)
      .finally(() => {
        abp.notify.info('Deleted Role: ' + entity.displayName);
        this.refresh();
      })
      .subscribe(() => { });
  }

  createOrUpdate(item: RoleDto) {
    // this.modalHelper
    //   .open(CreatOrUpdateRoleComponent, item)
    //   .subscribe(isSave => {
    //     if (isSave) {
    //       this.refresh();
    //     }
    //   });
  }

  create(): void {
    // this.modalHelper
    //   .open(CreateRoleComponent, {}, 'md', {
    //     nzMask: true,
    //   })
    //   .subscribe(isSave => {
    //     if (isSave) {
    //       this.refresh();
    //     }
    //   });
  }

  edit(item: RoleDto): void {
    // this.modalHelper
    //   .open(EditRoleComponent, { id: item.id }, 'md', {
    //     nzMask: true,
    //   })
    //   .subscribe(isSave => {
    //     if (isSave) {
    //       this.refresh();
    //     }
    //   });
  }
}
