import { Component, OnInit, RootRenderer, ViewChild, Input, Output, EventEmitter, OnChanges, Directive } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { FormGroup, FormControl, FormBuilder, NG_VALIDATORS, ValidatorFn } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { MatDialog, MatGridTileHeaderCssMatStyler } from '@angular/material';
import { QueryLovComponent } from 'src/app/modal/query-lov/query-lov.component';
import { LovParams, BaseBlock, BlokkType, FKColumns, ValidationResult, RecordType, LovColDef, QueryLovParams, ServerResult, ItemEvents, domItems, ItemTypes } from 'src/app/base/types';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { observe } from "rxjs-observe";
import { GridOptions } from 'ag-grid-community';
import { DomainService } from '../services/domain.service';
import { ServiceLocator } from '../services/locator.service';

export abstract class BaseForm {
    @Input() public name: string;

     /**
     *  @ignore
    */
      public domainServise: DomainService;

    public Blocks: Map<string, BaseBlock> = new Map();
    public Items: domItems[] = new Array();

    constructor(public queryDialog: MatDialog) {
        //this.domainServise = ServiceLocator.injector.get(DomainService);
    }

    public onKeydown(event, l_blockname: string, l_colname: string) {
        //console.log(this.Blocks.get(l_blockname).getrow());
        if (event.key === "ArrowRight" && event.ctrlKey === true) {

            this.nextClick(l_blockname);
        } else if (event.key === "ArrowLeft" && event.ctrlKey === true) {
            this.prevClick(l_blockname);
        }
        else if (event.key === "i" && event.ctrlKey === true) {
            this.createRow(l_blockname);
            this.itemEvent(ItemEvents.CreateRow, l_blockname, "", "")
        }
        else if (event.key === "f" && event.ctrlKey === true) {
            this.QueryLOV(l_blockname);
        }

        //this.name = event.key;

    }

    public node = document.querySelector('input');

    public input$ = Observable.fromEvent(this.node, 'input');

    postQuery(l_blockname: string, l_datarow: any) {
        if (this.Blocks.get(l_blockname).block_type == BlokkType.multipleRow) {
            this.itemEvent(ItemEvents.PostQuery, l_blockname, "", "", 0, this.Blocks.get(l_blockname).getrow());
        }
        else if (this.Blocks.get(l_blockname).block_type == BlokkType.Grid) {
            this.itemEvent(ItemEvents.PostQuery, l_blockname, "", "", 0, l_datarow);
        }
    }

    positionChanged(l_blockname: string) {
        this.postQuery(l_blockname, "");
        if (this.Blocks.get(l_blockname).DetBlocks) {
            this.Blocks.get(l_blockname).DetBlocks.forEach(element => {

                var l_id_col: string
                var l_fk_col: string
                element.fkColumns.forEach((value, key) => {
                    l_id_col = key;
                    l_fk_col = value;
                })
                var l_obs: Promise<object[]>;
                //Ha van fej rekord
                if (this.Blocks.get(l_blockname).getrow()) {
                    //A fej rekordhoz selectálja a tételeket
                    l_obs = this.Blocks.get(element.blockName).service.getByColumn(l_fk_col, this.Blocks.get(l_blockname).getrow()[l_id_col].toString());
                    l_obs.then(next => {
                        next.map(res => {
                            var a = Object.assign({}, res);
                            res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                            return res;
                        });

                        this.Blocks.get(element.blockName).setrows(next)
                        this.Blocks.get(element.blockName).setrow(this.Blocks.get(element.blockName).getrows()[0]);
                        this.itemEvent(ItemEvents.AfterQuery, element.blockName, "", "");
                    }).then(aa => {
                        this.positionChanged(element.blockName)
                    })

                }
                else this.blockClear(element.blockName);

                //this.positionChanged(element.blockName)
            });
        }
    }

    nextClick(l_blockname: string) {

        if (this.Blocks.get(l_blockname).block_type === BlokkType.multipleRow) {
            this.Blocks.get(l_blockname).setrow(
                this.Blocks.get(l_blockname).getrows()[
                this.Blocks.get(l_blockname).getrows().indexOf(this.Blocks.get(l_blockname).getrow()) + 1
                ]
            );
            this.positionChanged(l_blockname);
        }

        /*
        this.ordr = this.ordrs[this.ordrs.indexOf(this.ordr) + 1];
        this.rdr1$ = this.rdr1Serv.getByColumn("ORDR_ID", this.ordr.id.toString());
        var t: boolean = false;
        this.rdr1$.forEach(next => this.rdr1s = next);
        */
    }

    prevClick(l_blockname: string) {
        if (this.Blocks.get(l_blockname).block_type === BlokkType.multipleRow) {
            this.Blocks.get(l_blockname).setrow(
                this.Blocks.get(l_blockname).getrows()[
                this.Blocks.get(l_blockname).getrows().indexOf(this.Blocks.get(l_blockname).getrow()) - 1
                ]
            );
            this.positionChanged(l_blockname);
            /*
            if (this.Blocks.get(l_blockname).DetBlocks) {
                this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                    var l_id_col: string
                    var l_fk_col: string
                    element.fkColumns.forEach((value, key) => {
                        l_id_col = key;
                        l_fk_col = value;
                    })
                    var l_obs: Promise<object[]>;
                    l_obs = this.Blocks.get(element.blockName).service.getByColumn(l_fk_col, this.Blocks.get(l_blockname).getrow()[l_id_col].toString())
                        .then(next => {
                            this.Blocks.get(element.blockName).setrows(next);
                            this.Blocks.get(element.blockName).setrow(this.Blocks.get(element.blockName).getrows()[0]);
                        });
                    this.prevClick(element.blockName);
                });
            }
            */
        }

        /*
            this.ordr = this.ordrs[this.ordrs.indexOf(this.ordr) - 1];
            this.rdr1$ = this.rdr1Serv.getByColumn("ORDR_ID", this.ordr.id.toString());
            this.rdr1$.forEach(next => this.rdr1s = next);
    */
    }

    async createRow(l_blockname: string) {
        console.log("createRow");
        if (this.Blocks.get(l_blockname).block_type === BlokkType.multipleRow) {
            var l_obs: Promise<object[]>;
            l_obs = await this.Blocks.get(l_blockname).service.getNewRow().then(
                next => {
                    next["record_type"] = RecordType.Inserted;
                    this.Blocks.get(l_blockname).setrow(next);
                    if (this.Blocks.get(l_blockname).getrows() == null) {
                        this.Blocks.get(l_blockname).setrows(new Array(next))
                    }
                    else {
                        this.Blocks.get(l_blockname).getrows().push(next);
                    }

                    if (this.Blocks.get(l_blockname).DetBlocks) {
                        var l_fej_row = new Object(this.Blocks.get(l_blockname).getrow());
                        this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                            var l_id_col: string
                            var l_fk_col: string
                            element.fkColumns.forEach((value, key) => {
                                l_id_col = key;
                                l_fk_col = value;
                            })
                            this.Blocks.get(element.blockName).setrows(null)

                            var l_obs2: Promise<object>;
                            l_obs2 = this.Blocks.get(element.blockName).service.getNewRow();
                            l_obs2.then(res => {
                                res["record_type"] = RecordType.Inserted;
                                res[l_fk_col] = l_fej_row[l_id_col];

                                this.Blocks.get(element.blockName).setrows(new Array(res))
                                this.itemEvent(ItemEvents.CreateRow, element.blockName, "", "")

                            });


                        });
                    }
                }
            )

            //this.Blocks.get(l_blockname).getrows().push()
        }
        else if (this.Blocks.get(l_blockname).block_type === BlokkType.Grid) {
            if (this.Blocks.get(l_blockname).MasterBlocks) {

                if (this.Blocks.get(l_blockname).DetBlocks) {

                }
                else {
                    //this.Blocks.get(l_blockname).setrows(null)
                    var l_obs2: Promise<object>;
                    l_obs2 = this.Blocks.get(l_blockname).service.getNewRow();
                    l_obs2.then(res => {
                        res["record_type"] = RecordType.Inserted;

                        this.Blocks.get(l_blockname).MasterBlocks.forEach(element => {
                            var l_fej_row = new Object(this.Blocks.get(element.blockName).getrow());
                            var l_id_col: string
                            var l_fk_col: string
                            element.fkColumns.forEach((value, key) => {
                                l_id_col = value;
                                l_fk_col = key;
                            })
                            res[l_fk_col] = l_fej_row[l_id_col];
                        })

                        if (this.Blocks.get(l_blockname).getrows() == null) {
                            this.Blocks.get(l_blockname).setrows(new Array(res))
                        }
                        else {
                            this.Blocks.get(l_blockname).getrows().push(res);
                            //var res = this.gridApi.updateRowData({ add: [newItem] });
                        }
                        this.Blocks.get(l_blockname).agGrid.api.updateRowData({ add: [res] })
                        this.itemEvent(ItemEvents.CreateRow, l_blockname, "", "")
                    })
                }
            }

        }
    }

    async createRowNoVis(l_blockname: string) {
        console.log("createRow");
        if (this.Blocks.get(l_blockname).block_type === BlokkType.multipleRow) {
            console.log(this.Blocks.get(l_blockname));
            console.log("createRow2");
            var l_obs: Promise<object[]>;

            l_obs = await this.Blocks.get(l_blockname).service.getNewRow().then(
                next => {
                    console.log("createRow3");
                    console.log(next);
                    console.log("createRow4");
                    next["record_type"] = RecordType.Inserted;
                    if (this.Blocks.get(l_blockname).MasterBlocks) {
                        this.Blocks.get(l_blockname).MasterBlocks.forEach(element => {
                            var l_fej_row = new Object(this.Blocks.get(element.blockName).getrow());
                            var l_id_col: string
                            var l_fk_col: string
                            element.fkColumns.forEach((value, key) => {
                                l_id_col = value;
                                l_fk_col = key;
                            })
                            next[l_fk_col] = l_fej_row[l_id_col];
                        })

                        this.Blocks.get(l_blockname).setrow(next);
                        if (this.Blocks.get(l_blockname).getrows() == null) {
                            this.Blocks.get(l_blockname).setrows(new Array(next))
                        }
                        else {
                            this.Blocks.get(l_blockname).getrows().push(next);
                            //var res = this.gridApi.updateRowData({ add: [newItem] });
                        }
                        this.itemEvent(ItemEvents.CreateRow, l_blockname, "", "")

                    }
                    else {
                        this.Blocks.get(l_blockname).setrow(next);
                        if (this.Blocks.get(l_blockname).getrows() == null) {
                            this.Blocks.get(l_blockname).setrows(new Array(next))
                        }
                        else {
                            this.Blocks.get(l_blockname).getrows().push(next);
                        }
                    }

                    if (this.Blocks.get(l_blockname).DetBlocks) {
                        var l_fej_row = new Object(this.Blocks.get(l_blockname).getrow());
                        this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                            var l_id_col: string
                            var l_fk_col: string
                            element.fkColumns.forEach((value, key) => {
                                l_id_col = key;
                                l_fk_col = value;
                            })
                            this.Blocks.get(element.blockName).setrows(null)

                        });
                    }
                }
            ).then(a => { return true })

            //this.Blocks.get(l_blockname).getrows().push()
        }
        console.log("createRowEND");
        //return true;             
    }

    blockClear(l_blockname: string) {
        //console.log(this.Blocks.get(l_blockname));
        this.Blocks.get(l_blockname).setrow(null);
        this.Blocks.get(l_blockname).setrows(null);
    }

    blockRefresh(l_blockname: string) {

        //Ha egysoros a blokk
        if (this.Blocks.get(l_blockname).block_type == BlokkType.multipleRow || this.Blocks.get(l_blockname).block_type == BlokkType.Grid) {
            //console.log(this.Blocks.get(l_blockname).DetBlocks)
            //Ha van detail blokk
            if (this.Blocks.get(l_blockname).DetBlocks && !this.Blocks.get(l_blockname).MasterBlocks) {
                var l_where = this.Blocks.get(l_blockname).DefaultWhere;
                //console.log("11")
                var l_obs1: Promise<object[]>;

                l_obs1 = this.Blocks.get(l_blockname).service.getAllByWhere(l_where)
                    //l_obs1 = this.Blocks.get(l_blockname).service.getAll()
                    .then(next => {
                        next.map(res => {
                            var a = Object.assign({}, res);
                            res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                            return res;
                        });
                        this.Blocks.get(l_blockname).setrows(next);
                        this.Blocks.get(l_blockname).setrow(this.Blocks.get(l_blockname).getrows()[0]);

                        /*this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                            this.blockRefresh(element.blockName);
                        });*/
                        this.positionChanged(l_blockname);
                    })

            }
            else if (!this.Blocks.get(l_blockname).DetBlocks && !this.Blocks.get(l_blockname).MasterBlocks) {
                var l_where = this.Blocks.get(l_blockname).DefaultWhere;
                //console.log("11")
                var l_obs1: Promise<object[]>;
                l_obs1 = this.Blocks.get(l_blockname).service.getAllByWhere(l_where)
                    //l_obs1 = this.Blocks.get(l_blockname).service.getAll()
                    .then(next => {
                        next.map(res => {
                            var a = Object.assign({}, res);
                            res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                            return res;
                        });
                        this.Blocks.get(l_blockname).setrows(next);
                        this.Blocks.get(l_blockname).setrow(this.Blocks.get(l_blockname).getrows()[0]);

                        /*this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                            this.blockRefresh(element.blockName);
                        });*/
                        this.positionChanged(l_blockname);
                    })

            }
            else if ((this.Blocks.get(l_blockname).MasterBlocks)) {
                //console.log("2")
                var l_where = this.Blocks.get(l_blockname).DefaultWhere;
                var l_where_fk = " 1=1 ";

                //A master blokkok kezelése
                this.Blocks.get(l_blockname).MasterBlocks.forEach(element => {

                    var l_id_col: string
                    var l_fk_col: string
                    var l_master_block = element.blockName;
                    element.fkColumns.forEach((value, key) => {
                        l_fk_col = key;
                        l_id_col = value;
                        l_where_fk = l_where_fk + " and " + l_fk_col + " = '" + this.Blocks.get(l_master_block).getrow()[l_id_col] + "'";
                        //console.log(l_where_fk);
                    });
                    if (l_where != "") {
                        l_where = l_where + " and " + l_where_fk;
                    } else l_where = l_where_fk;

                    var l_obs: Promise<object[]>;
                    l_obs1 = this.Blocks.get(l_blockname).service.getAllByWhere(l_where)
                        //l_obs = this.Blocks.get(l_blockname).service.getByColumn(l_fk_col, this.Blocks.get(element.blockName).getrow()[l_id_col].toString())
                        .then(next => {
                            next.map(res => {
                                var a = Object.assign({}, res);
                                res["old_data"] = a;
                                res["record_type"] = RecordType.Original;
                                return res;
                            });

                            this.Blocks.get(l_blockname).setrows(next)
                            this.Blocks.get(l_blockname).setrow(this.Blocks.get(l_blockname).getrows()[0]);
                            this.positionChanged(l_blockname);

                            /*if (this.Blocks.get(l_blockname).DetBlocks) {
                                this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                                    this.blockRefresh(element.blockName);
                                })
                            };*/
                        });
                });
            }
        }
        //this.Blocks.get(l_blockname).service
    }


    async blockRefreshAwait(l_blockname: string) {

        //Ha egysoros a blokk
        if (this.Blocks.get(l_blockname).block_type == BlokkType.multipleRow || this.Blocks.get(l_blockname).block_type == BlokkType.Grid) {
            //console.log(this.Blocks.get(l_blockname).DetBlocks)
            //Ha van detail blokk
            if (this.Blocks.get(l_blockname).DetBlocks && !this.Blocks.get(l_blockname).MasterBlocks) {
                var l_where = this.Blocks.get(l_blockname).DefaultWhere;
                var l_obs1: Promise<object[]>;
                l_obs1 = this.Blocks.get(l_blockname).service.getAllByWhere(l_where)
                    //l_obs1 = this.Blocks.get(l_blockname).service.getAll()
                    .then(next => {
                        next.map(res => {
                            var a = Object.assign({}, res);
                            res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                            return res;
                        });
                        this.Blocks.get(l_blockname).setrows(next);
                        this.Blocks.get(l_blockname).setrow(this.Blocks.get(l_blockname).getrows()[0]);

                        /*this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                            this.blockRefresh(element.blockName);
                        });*/
                        this.positionChanged(l_blockname);
                    })

            }
            else if (!this.Blocks.get(l_blockname).DetBlocks && !this.Blocks.get(l_blockname).MasterBlocks) {
                var l_where = this.Blocks.get(l_blockname).DefaultWhere;
                var l_obs1: Promise<object[]>;
                l_obs1 = this.Blocks.get(l_blockname).service.getAllByWhere(l_where)
                    //l_obs1 = this.Blocks.get(l_blockname).service.getAll()
                    .then(next => {
                        next.map(res => {
                            var a = Object.assign({}, res);
                            res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                            return res;
                        });
                        this.Blocks.get(l_blockname).setrows(next);
                        this.Blocks.get(l_blockname).setrow(this.Blocks.get(l_blockname).getrows()[0]);

                        /*this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                            this.blockRefresh(element.blockName);
                        });*/
                        this.positionChanged(l_blockname);
                    })

            }
            else if ((this.Blocks.get(l_blockname).MasterBlocks)) {
                var l_where = this.Blocks.get(l_blockname).DefaultWhere;
                var l_where_fk = " 1=1 ";

                //A master blokkok kezelése
                this.Blocks.get(l_blockname).MasterBlocks.forEach(element => {

                    var l_id_col: string
                    var l_fk_col: string
                    var l_master_block = element.blockName;
                    element.fkColumns.forEach((value, key) => {
                        l_fk_col = key;
                        l_id_col = value;
                        l_where_fk = l_where_fk + " and " + l_fk_col + " = '" + this.Blocks.get(l_master_block).getrow()[l_id_col] + "'";
                        //console.log(l_where_fk);
                    });
                    if (l_where != "") {
                        l_where = l_where + " and " + l_where_fk;
                    } else l_where = l_where_fk;

                    var l_obs: Promise<object[]>;
                    l_obs1 = this.Blocks.get(l_blockname).service.getAllByWhere(l_where)
                        //l_obs = this.Blocks.get(l_blockname).service.getByColumn(l_fk_col, this.Blocks.get(element.blockName).getrow()[l_id_col].toString())
                        .then(next => {
                            next.map(res => {
                                var a = Object.assign({}, res);
                                res["old_data"] = a;
                                res["record_type"] = RecordType.Original;
                                return res;
                            });

                            this.Blocks.get(l_blockname).setrows(next)
                            this.Blocks.get(l_blockname).setrow(this.Blocks.get(l_blockname).getrows()[0]);
                            this.positionChanged(l_blockname);

                            /*if (this.Blocks.get(l_blockname).DetBlocks) {
                                this.Blocks.get(l_blockname).DetBlocks.forEach(element => {
                                    this.blockRefresh(element.blockName);
                                })
                            };*/
                        });
                });
            }
        }
        //this.Blocks.get(l_blockname).service
    }

    onCellValueChanged(params, l_entityname: string) {
        console.log("onCellValueChanged:" + params.name);
        //console.log(params);        

        //params.api.stopEditing();

        if (params.oldValue != params.newValue || params.newValue.toString() == '') {
            var l_obs2: Promise<object>;
            //console.log("onCellValueChanged")
            var l_datarow = this.Blocks.get(l_entityname).getrow();

            var l_row_index = this.Blocks.get(l_entityname).getrows().indexOf(l_datarow);

            l_obs2 = this.Blocks.get(l_entityname).service.validate(params.column.getId(), params.newValue.toString(), params.data)
                .then(res => {

                    if ((res as ValidationResult).code == 0) {
                        //params.api.getRowNode(params.data.id).setData((res as ValidationResult).value);
                        /*
                        */
                        var l_new_row = Object.assign({}, (res as ValidationResult).value);
                        var l_old_row = Object.assign({}, this.Blocks.get(l_entityname).getrow()["old_data"]);
                        if (this.Blocks.get(l_entityname).getrow()["record_type"] != RecordType.Inserted) {
                            l_new_row["old_data"] = Object.assign({}, this.Blocks.get(l_entityname).getrow()["old_data"]);
                            l_new_row["record_type"] = RecordType.Modified;

                        } else {
                            l_new_row["record_type"] = RecordType.Inserted;
                        }
                        params.api.getRowNode(params.data.id).setData(l_new_row);
                        this.Blocks.get(l_entityname).setrow(l_new_row);
                        this.Blocks.get(l_entityname).getrows()[l_row_index] = l_new_row;

                        /*
                        */


                        this.itemValidate(l_entityname, params.column.getId(), params.newValue, 0, params.data)
                    }
                    else {
                        //alert.call((res as ValidationResult).message);
                        alert((res as ValidationResult).message);
                    }
                    //params.api.stopEditing(true);
                });
            //console.log("TESZT VALIDAL");

        }


    }

    outFocus(event: any, l_entityname: string, l_colname: string) {
        //console.log(this.Blocks.get(l_entityname).getrow());
        //console.log("VAL");
        //console.log(this.Blocks.get(l_entityname).getrow()["old_data"]);
        if (this.Blocks.get(l_entityname).getrow()["record_type"] == RecordType.Inserted || this.Blocks.get(l_entityname).getrow()["old_data"][l_colname] != event.target.value) {

            var l_datarow = this.Blocks.get(l_entityname).getrow();
            var l_row_index = this.Blocks.get(l_entityname).getrows().indexOf(l_datarow);

            var l_obs2: Promise<object>;
            l_obs2 = this.Blocks.get(l_entityname).service.validate(l_colname, event.target.value, l_datarow)
                .then(res => {
                    if ((res as ValidationResult).code == 0) {
                        //console.log(res);
                        var l_new_row = Object.assign({}, (res as ValidationResult).value);
                        var l_old_row = Object.assign({}, this.Blocks.get(l_entityname).getrow()["old_data"]);
                        if (this.Blocks.get(l_entityname).getrow()["record_type"] != RecordType.Inserted) {
                            l_new_row["old_data"] = Object.assign({}, this.Blocks.get(l_entityname).getrow()["old_data"]);
                            l_new_row["record_type"] = RecordType.Modified;

                        } else {
                            l_new_row["record_type"] = RecordType.Inserted;
                        }
                        //console.log(l_new_row);
                        this.Blocks.get(l_entityname).setrow(l_new_row);
                        this.Blocks.get(l_entityname).getrows()[l_row_index] = l_new_row;
                        if (this.itemValidate(l_entityname, l_colname, event.target.value, 0, l_new_row)) {

                        }
                        else {

                        }
                    }
                    else {
                        alert((res as ValidationResult).message);
                    }
                    //params.api.stopEditing(true);
                });
            //console.log("TESZT VALIDAL");
        }


    }

    private l_data: any[][];


    onSubmit(): void {
        var i = 0;
        this.l_data = [];
        this.Blocks.forEach(next => {
            console.log("UPDATE")
            //console.log(next.getrows().filter(element => element["record_type"] == RecordType.Modified));
            this.l_data[i] = next.getrows().filter(element => element["record_type"] == RecordType.Modified)
            //console.log(this.l_data[i])
            i++;
        });

        //console.log(this.Blocks.values().next().value);
        console.log(this.l_data);

        (this.Blocks.values().next().value as BaseBlock).service.updateMain(this.l_data).then(response => {
            if ((response as ServerResult).result == false) {
                alert(`Hiba kód ${(response as ServerResult).errorCode}, Hiba üzenet: ${(response as ServerResult).errorMessage}`)
            } else {
                i = 0;
                this.Blocks.forEach(next => {
                    next.getrows().filter(element => element["record_type"] == RecordType.Modified)
                        .map(res => {
                            //var a = Object.assign({}, res);
                            //res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                        });
                });
            }

        },
            err => {
                console.error(err);
                alert("Hiba a kommunikációban");
            }
        );

        i = 0;
        this.l_data = [];
        this.Blocks.forEach(next => {
            console.log("INSERT");
            this.l_data[i] = next.getrows().filter(element => element["record_type"] == RecordType.Inserted)
            //console.log(this.l_data[i])
            i++;
        });

        (this.Blocks.values().next().value as BaseBlock).service.insertMain(this.l_data).then(response => {
            //console.log(response)
            if ((response as ServerResult).result == false) {
                alert(`Hiba kód ${(response as ServerResult).errorCode}, Hiba üzenet: ${(response as ServerResult).errorMessage}`)
            } else {
                i = 0;
                this.Blocks.forEach(next => {
                    next.getrows().filter(element => element["record_type"] == RecordType.Inserted)
                        .map(res => {
                            var a = Object.assign({}, res);
                            res["old_data"] = a;
                            res["record_type"] = RecordType.Original;
                        });
                });
            }

        },
            err => {
                console.error(err);
                alert("Hiba a kommunikációban");
            }
        );

    }

    ViewportChangedEvent(event: any, l_entityname: string) {
        var i = 0;
        var l_array = this.Blocks.get(l_entityname).getrows().slice(event["firstRow"], event["lastRow"])
        l_array.forEach(next => this.postQuery(l_entityname, next))
    }

    public gridOptions: GridOptions;

    onCellClicked(event, l_entityname: string) {
        this.itemEvent(ItemEvents.CellClicked, l_entityname, event.colDef.field, event.value, event.rowIndex, event.data, event)
    }

    onCellKeyPress(event, l_entityname) {
        this.itemEvent(ItemEvents.CellClicked, l_entityname, event.colDef.field, event.value, event.rowIndex, event.data, event)
    }

    oncellFocused(event, l_entityname: string) {
        if (event.rowIndex != null) {
            var rowNode1 = event.api.getDisplayedRowAtIndex(event.rowIndex).data;

            this.Blocks.get(l_entityname).setrow(event.api.getDisplayedRowAtIndex(event.rowIndex).data);
        }
    }

    onSelectionChanged(event, l_entityname: string) {


        //.filter(element => element["id"] == RecordType.Modified

        //this.Blocks.get(l_entityname).setrow(event.api.getSelectedRows()[0])

        this.Blocks.get(l_entityname).setrow(
            this.Blocks.get(l_entityname).getrows()[
            this.Blocks.get(l_entityname).getrows().indexOf(event.api.getSelectedRows()[0])
            ]
        );


        this.positionChanged(l_entityname);
        /*
          var selectedRows = this.agGrid.api.getSelectedRows();
        var selectedRowsString = "";
        selectedRows.forEach(function (selectedRow, index) {
          if (index == 0) {
            selectedRowsString = selectedRow.name + " " + selectedRow.price;
            return;
          }
        });
        */
        //alert(selectedRowsString);
    }

    setColumnEditable(l_entityname: string, l_colname: string, l_enabled: boolean) {
        if (this.Blocks.get(l_entityname).block_type == BlokkType.multipleRow) {
            var l_item = this.Items.filter(element => element["entityName"] == l_entityname && element["colName"] == l_colname && element["type"] == ItemTypes.INPUT)[0]
            l_item.item.readOnly = !l_enabled;

        }

        else if (this.Blocks.get(l_entityname).block_type == BlokkType.Grid) {
            if (this.Blocks.get(l_entityname).agGrid) {
                if (l_enabled) {
                    this.Blocks.get(l_entityname).agGrid.api.gridCore.gridOptions.columnDefs.filter(element => element["field"] == l_colname)[0].cellStyle = { background: 'transparent' };
                } else this.Blocks.get(l_entityname).agGrid.api.gridCore.gridOptions.columnDefs.filter(element => element["field"] == l_colname)[0].cellStyle = { background: 'lightgray' };
                this.Blocks.get(l_entityname).agGrid.columnApi.columnController.columnDefs.filter(element => element["field"] == l_colname)[0].editable = l_enabled;
                this.Blocks.get(l_entityname).agGrid.api.setColumnDefs(this.Blocks.get(l_entityname).agGrid.columnApi.columnController.columnDefs);


            }
        }
    }

    setRowEditable(l_entityname: string, l_enabled: boolean) {
        if (this.Blocks.get(l_entityname).block_type == BlokkType.multipleRow) {
            this.Items.filter(element => element["entityName"] == l_entityname && element["type"] == ItemTypes.INPUT).forEach(
                item => this.setColumnEditable(l_entityname, item.colName, l_enabled));
        }
        else if (this.Blocks.get(l_entityname).block_type == BlokkType.Grid) {
            this.Blocks.get(l_entityname).agGrid.columnApi.columnController.columnDefs.forEach(item => {
                if (l_enabled) {
                    this.Blocks.get(l_entityname).agGrid.api.gridCore.gridOptions.columnDefs.filter(element => element["field"] == item.field)[0].cellStyle = { background: 'white' };
                } else this.Blocks.get(l_entityname).agGrid.api.gridCore.gridOptions.columnDefs.filter(element => element["field"] == item.field)[0].cellStyle = { background: 'lightgray' };
                this.Blocks.get(l_entityname).agGrid.columnApi.columnController.columnDefs.filter(element => element["field"] == item.field)[0].editable = l_enabled;
            });
            //console.log(this.Blocks.get(l_entityname).agGrid.api.gridCore.gridOptions)
            this.Blocks.get(l_entityname).agGrid.api.setColumnDefs(this.Blocks.get(l_entityname).agGrid.columnApi.columnController.columnDefs);
        }
    }

    onGridReady(l_event: any, l_entityname: string) {
        this.Blocks.get(l_entityname).agGrid = l_event;

        //l_event.columnApi.columnController.columnDefs[0].editable = false;
        //l_event.api.setColumnDefs(l_event.columnApi.columnController.columnDefs);

        /*
        Események hozzáadása a gridhez
        */

        l_event.api.addEventListener('cellClicked', (event) => {
            this.onCellClicked(event, l_entityname);
        });

        l_event.api.addEventListener('cellValueChanged', (event) => {
            this.onCellValueChanged(event, l_entityname);
        });

        l_event.api.addEventListener('cellKeyPress', (event) => {
            this.onCellKeyPress(event, l_entityname);
        });

        l_event.api.addEventListener('viewportChanged', (event) => {
            this.ViewportChangedEvent(event, l_entityname);
        });


        l_event.api.addEventListener('selectionChanged', (event) => {
            this.onSelectionChanged(event, l_entityname);
        });

        l_event.api.addEventListener('cellFocused', (event) => {
            this.oncellFocused(event, l_entityname);
        });


    }

    getdocName(l_node: ChildNode, l_entityname?: string): string {
        //console.log(l_node.nodeName);
        var l_item = new domItems();

        if (l_node.nodeName == "INPUT") {

            var l_html_item = l_node.parentElement.getElementsByTagName("Input").item(0)
            this.queryLovColDef = new LovColDef();

            this.queryLovColDef.headerName = l_node.parentElement.getElementsByTagName("label").item(0)["textContent"];
            this.queryLovColDef.field = l_node.parentElement.getElementsByTagName("Input").item(0)["name"];
            this.queryLovColDefs.push(this.queryLovColDef);

            l_item.entityName = l_entityname;
            l_item.colName = this.queryLovColDef.field;
            l_item.type = ItemTypes.INPUT;
            l_item.item = l_node.parentElement.getElementsByTagName("Input").item(0);

            this.Items.push(l_item);

            /*
                Események hozzáadása a gridhez
            */

            l_html_item.addEventListener('keydown', (event) => {
                this.onKeydown(event, l_entityname, l_html_item["name"]);
            });

            l_html_item.addEventListener('blur', (event) => {
                this.outFocus(event, l_entityname, l_html_item["name"]);
            });

            return l_node["name"];
        }
        else if (l_node.nodeName == "LABEL") {
            //console.log(l_node);
            return l_node["name"];
        }
        else if (l_node.nodeName == "AG-GRID-ANGULAR") {
            //this.Blocks.get(l_entityname).agGrid.api.addEventListener('viewportChanged',this.ViewportChangedEvent.prototype(event,l_entityname))
            l_item.entityName = l_entityname;
            l_item.type = ItemTypes.GRID;
            l_item.item = l_node.parentElement.getElementsByTagName("AG-GRID-ANGULAR").item(0);
            //l_item.item.setAttribute("gridOptions","gridOptions");

            //console.log(this.gridOptions.columnDefs);
            this.Items.push(l_item);

            //console.log(document.querySelectorAll('div[role="row"]'));



            return ""
        }
        else if (l_node.hasChildNodes) {
            l_node.childNodes.forEach(element => {
                this.getdocName(element, l_entityname);
            });
        }

        return "";
    }

    public Init() {

        this.Blocks.forEach(element => {
            //console.log(element.block_name)
            if (document.querySelector(`#${element.block_name}`))
                document.querySelector(`#${element.block_name}`).childNodes.forEach(next => {
                    //console.log(next);
                    this.getdocName(next, element.block_name)
                });



        })
    };

    private queryLovColDef: LovColDef;
    private queryLovColDefs: LovColDef[] = new Array();

    private l_QuerylovParam: QueryLovParams = new QueryLovParams();

    QueryLOV(l_blockname: string): void {

        this.Blocks.get(l_blockname).getrows()

        const simpleObservable = new Observable((observer) => {

            // observable execution
            observer.next("bla bla bla")
            observer.complete()
        })

        this.l_QuerylovParam.index = this.Blocks.get(l_blockname).getrow()["id"];
        this.l_QuerylovParam.columnDefs = this.queryLovColDefs;

        this.l_QuerylovParam.title = "Keresés"
        this.l_QuerylovParam.columnRet = "itemcode";
        this.l_QuerylovParam.item$ = this.Blocks.get(l_blockname).getrows();
        this.l_QuerylovParam.service = this.Blocks.get(l_blockname).service;
        this.l_QuerylovParam.FoundRowStyleRule = function (params) {
            if (params.node.data["id"] == dialogRef.componentInstance.data.index)
                return true;
        };
        //console.log(this.l_lovParam.item$);

        const dialogRef = this.queryDialog.open(QueryLovComponent, {
            width: '550',
            data: this.l_QuerylovParam
        }
        );

        /*
        var observable = interval(1000).subscribe(value => {
          if (dialogRef && dialogRef.componentInstance) {
            console.log(dialogRef.componentInstance.data);
          }
          console.log(value);
        });
      */
        const sub = dialogRef.componentInstance.newRecord.subscribe((data) => {
            if (this.Blocks.get(l_blockname).block_type === BlokkType.multipleRow) {
                this.Blocks.get(l_blockname).setrow(data);
                this.positionChanged(l_blockname);
            }
            //alert(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            //observable.unsubscribe();
        });

    }

    public getItemValue(l_entityname: string, l_colname: string): any {
        return this.Blocks.get(l_entityname).getrow()[l_colname];
    }

    public setItemValue(l_entityname: string, l_colname: string, l_value: any) {
        console.log("SETITEM");
        var l_datarow = this.Blocks.get(l_entityname).getrow();
        console.log(l_datarow);
        var l_row_index = this.Blocks.get(l_entityname).getrows().indexOf(l_datarow);
        var l_row_id = this.Blocks.get(l_entityname).getrow()["id"].toString()

        //console.log(l_row_id);
        l_datarow[l_colname] = l_value;
        //console.log(l_datarow);
        this.Blocks.get(l_entityname).setrow(l_datarow);
        this.Blocks.get(l_entityname).getrows()[l_row_index] = l_datarow;
        if (this.Blocks.get(l_entityname).block_type == BlokkType.Grid) {
            this.Blocks.get(l_entityname).agGrid.api.getRowNode(l_row_id.toString()).setData(l_datarow);
        }
    }

    async delay(ms: number) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
    }

    public setItemValue2(l_entityname: string, l_colname: string, l_value: any, id: string) {
        console.log("SETITEM2");
        var l_datarow = this.Blocks.get(l_entityname).getrow();
        //console.log(l_datarow);
        var l_row_index = this.Blocks.get(l_entityname).getrows().indexOf(l_datarow);

        //console.log(l_row_index);
        l_datarow[l_colname] = l_value;
        //console.log(l_datarow);
        this.Blocks.get(l_entityname).setrow(l_datarow);
        this.Blocks.get(l_entityname).getrows()[l_row_index] = l_datarow;
        if (this.Blocks.get(l_entityname).block_type == BlokkType.Grid) {
            this.Blocks.get(l_entityname).setgridrow(l_datarow, l_row_index.toString());
            //agGrid.api.getRowNode(l_row_index.toString()).setData(l_datarow);
            //this.Blocks.get(l_entityname).agGrid.api.getRowNode(l_row_index.toString()).setData(l_datarow); 
        }
    }

    dateparser(params: any): string {
        var newValue = new Date(params.data[params.colDef.field]);
        return newValue.toLocaleDateString();
    }

    numberFormatter(params: any): string {
        var newValue = Number(params.data[params.colDef.field]);
        return newValue.toLocaleString();
    }


    /**
    * @example
    * await this.getDomainBySql(sql);
    *
    * @param {string} l_domain_sql Az SQL
    *
    */
     async getDomainBySql(l_domain_sql: string) {
        var a: any[];
        console.log("gwtDomainBySql ben van")
        console.log(l_domain_sql);
        await this.domainServise.getBySelect(l_domain_sql).then(val => {
            a = val;
          });
          return a;
    }

    /**
    * TRUE ha a formon vannak módosult vagy új rekordok. FALSE ha nincsenek
    * @example
    * if (this.hasModifiedBlocks()) {
    * TODO
    * }
    *
    */



    public abstract itemValidate(l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any): boolean

    public abstract itemEvent(l_event: ItemEvents, l_entityname: string, l_colname: string, l_value: string, l_rowindex?: number, l_data?: any, l_orig_event?: any): boolean
}
