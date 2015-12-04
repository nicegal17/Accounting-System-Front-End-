'use strict';

angular.module('accounting')
    .factory('ReportingService', function() {
        return {
            printData: function(divToPrint) {
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
                                <h3>\
                                    <img src="/img/ionic.png" alt="DS System" style="width:70px;">\
                                    ACCOUNTING SYSTEM\
                                    <img src="/img/avatar.jpg" alt="DS System" style="width:70px;">\
                                </h3>\
                            </div>\
                            <div class="row">\
                                <div class="col-xs-12">' + divToPrint.innerHTML + '</div>\
                            </div>\
                        </div>\
                        <div class="row">\
                            <br></br>\
                            <div class="col-xs-12 col-xs-offset-2">\
                                <div class="col-xs-4">\
                                    <hr>\
                                    <center>\
                                        <strong>Prepared by:</strong>\
                                        <br><br>\
                                        <b>Juan Dela Cruz</b>\
                                        <small>Officer In-Charge</small>\
                                    </center>\
                                </div>\
                                <div class="col-xs-4">\
                                    <hr>\
                                    <center>\
                                        <strong>Noted By:</strong>\
                                        <br><br>\
                                        <b>Juanita Dela Cruz</b>\
                                        <small>Another Officer In-Charge</small>\
                                    </center>\
                                    </div>\
                                </div>\
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
