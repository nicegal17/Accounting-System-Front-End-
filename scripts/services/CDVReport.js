'use strict';

angular.module('accounting')
    .factory('CDVReportService', function() {
        return {
            printCDVData: function(divToPrint) {
                var newWin = window.open('', 'Print-Window', 'width=800,height=600');

                var content = '<!DOCTYPE html>\
                    <html xmlns="http://www.w3.org/1999/xhtml">\
                    <head>\
                        <meta charset="utf-8">\
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
                        <meta name="description" content="">\
                        <meta name="author" content="">\
                        <title></title>\
                        <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">\
                        <link rel="stylesheet" href="bower_components/fontawesome/css/font-awesome.min.css">\
                        <link rel="stylesheet" href="bower_components/ng-table/dist/ng-table.css"/>\
                        <style type="text/css" media="screen">body {padding-top: 50px;} </style>\
                    </head>\
                    <body onload="window.print()">\
                    <div class="container">\
                        <div class="row">\
                            <div class="col-xs-12">\
                                <div class="text-center">\
                                <img src="/img/smsi.png" alt="SMSi Logo" class="img-responsive" style="width:300px;height:100px;">\
                            </div>\
                            <div class="row">\
                                <div class="col-xs-12">\
                                <table class="table table-hover table-responsive">\
                    <thead><br><br>\
                        <tr>\
                            <h3 class="text-center">Check Disbursement Voucher</h3><br>\
                            <th class="text-center">CDV No</th>\
                            <th class="text-center">Date</th>\
                            <th class="text-center">Particular</th>\
                            <th class="text-center">Account Title</th>\
                            <th class="text-center">Debit</th>\
                            <th class="text-center">Credit</th>\
                        </tr>\
                    </thead>\
                    <tbody>\
                        <tr ng-repeat="accnt in accnts">\
                            <td>\
                                <span ng-show="accnt.idAcctTitleDB != null && accnt.idAcctTitleCR == null">{{accnt.CDVNo}}</span>\
                            </td>\
                            <td>\
                                <span ng-show="accnt.idAcctTitleDB != null && accnt.idAcctTitleCR == null">{{accnt.chkDate}}</span>\
                            </td>\
                            <td>\
                                <span ng-show="accnt.idAcctTitleDB != null && accnt.idAcctTitleCR == null">{{accnt.particular}}</span>\
                            </td>\
                            <td>\
                                <span ng-show="accnt.idAcctTitleDB != null && accnt.idAcctTitleCR == null">{{accnt.acctTitle}}</span>\
                                <span ng-show="accnt.idAcctTitleDB == null && accnt.idAcctTitleCR != null">&nbsp;&nbsp;&nbsp;&nbsp;{{accnt.acctTitle}}</span>\
                            </td>\
                            <td>\
                                <span ng-show="accnt.idAcctTitleDB != null && accnt.idAcctTitleCR == null"> {{accnt.amount}} </span>\
                                <span ng-show="accnt.idAcctTitleDB == null && accnt.idAcctTitleCR != null"></span>\
                            </td>\
                            <td>\
                                <span ng-show="accnt.idAcctTitleCR != null && accnt.idAcctTitleDB == null"> {{accnt.amount}} </span>\
                                <span ng-show="accnt.idAcctTitleCR == null && accnt.idAcctTitleDB != null"></span>\
                            </td>\
                        </tr>\
                    </tbody> ' + divToPrint.innerHTML + '</table></div>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <br></br>\
                            <div class="col-xs-12 col-xs-offset-2">\
                            </div>\
                        </div>\
                        </body>\
                        </html>';


                newWin.document.open();
                newWin.document.write(content);
                newWin.document.close();
            }
        };
    });
