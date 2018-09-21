import { RoleServiceProxy, GetRoleForEditOutput } from '@shared/service-proxies/service-proxies';
import { RoleEditDto, RoleDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, Input, ViewChild } from '@angular/core';
import { ModalComponentBase } from '@shared/component-base/modal-component-base';
import { SFSchema, SFComponent } from '@delon/form';
import { ArrayService } from '@delon/util';
import { NzTreeNode, NzTreeComponent, NzFormatEmitEvent } from 'ng-zorro-antd';

@Component({
  selector: 'app-creat-or-update-role',
  templateUrl: './creat-or-update-role.component.html',
  styles: []
})
export class CreatOrUpdateRoleComponent extends ModalComponentBase implements OnInit {

  @ViewChild('permisionTree') permisionTree: NzTreeComponent;
  @ViewChild('sf') sf: SFComponent;

  @Input() id: number;
  nodes: NzTreeNode[];
  constructor(
    public arrayService: ArrayService,
    public roleServiceProxy: RoleServiceProxy,
    injector: Injector) {
    super(injector);
  }
  saving = false;
  entity: GetRoleForEditOutput;
  schema: SFSchema = {
    properties: {
      role: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: '角色'
          },
          displayName: {
            type: 'string',
            title: '显示名称'
          },
          description: {
            type: 'string',
            title: '描述',
            ui: {
              widget: 'textarea',
              autosize: { minRows: 2, maxRows: 6 }
            }
          }
        },
        required: ['displayName', 'name']
      },

    }
  };

  checkedKeys = [];
  ngOnInit() {
    this.roleServiceProxy.getRoleForEdit(this.id).finally(() => {


    }).subscribe(res => {
      this.entity = res;
      this.checkedKeys = res.grantedPermissionNames;
      this.nodes = this.arrayService.arrToTreeNode(res.permissions, {
        idMapName: 'name',
        parentIdMapName: 'parentName',
        titleMapName: 'displayName',
        cb: w => {
          w.expanded = true;

          //w.checked = res.grantedPermissionNames.findIndex(x => x == w.key) > 0
        }
      });
    });
  }


  treeCheckboxChange(event: NzFormatEmitEvent) {

    // console.log(event);

    // var node = event.node;
    // // console.log(node);
    // if (node.isChecked) {
    //   if (node.parentNode != null) {

    //     if (this.checkedKeys.indexOf(node.parentNode.key) == -1) {
    //       node.parentNode.isChecked = true;
    //       event.checkedKeys.push(node.parentNode)
    //       console.log(this.checkedKeys);
    //     }
    //   }
    // }
    // console.log(node);
  }

  save(vl: SFComponent) {


    if (!vl.valid) {
      abp.notify.error('检测表单是否正确');
      return;
    }
    var val = vl.value;
    val.role.id = this.entity.role.id;
    let roleDto: RoleDto = new RoleDto();
    //roleDto.
    roleDto.init(val.role);
    roleDto.permissions = this.arrayService.getKeysByTreeNode(this.nodes, { includeHalfChecked: true });//this.permisionTree.getCheckedNodeList().map(x => x.key);
    this.saving = true;
    if (val.role.id) {
      this.roleServiceProxy.update(roleDto).finally(() => {

        this.saving = false;
      }).subscribe(res => {

        this.success(true);

      });
    } else {

      this.roleServiceProxy.create(roleDto).finally(() => {

        this.saving = false;
      }).subscribe(res => {

        this.success(true);

      });
    }

  }
}
