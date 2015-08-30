var myApp = angular.module('myApp', []);

myApp.controller('TipidMoCtrl', ['$scope', function($scope) {
  
  /**
   * The App's dialog box that prompts the user
   * to input his/her expenses
   *
   * app_dialog.amount        : for entering the amount in numeric value
   * app_dialog.description   : for putting some description on your expense
   * app_dialog.date          : to store date information of your expense
   */
  $scope.app_dialog = {
    totalAmount: '',
  	amount: '',
  	description: '',
  	date: '',
  	open: false,
    // function to store on the inputted data. I am using the localStorage
    // in the meantime to store the data for this app.
  	saveExpense: function() {
      if (typeof Storage != "undefined") {
        console.log("Web Storage is available");

        // name format for storing a value from a particular date
        // TM-00-00-00 is the stored name
        // The actual value is in JSON format
        //   {total: '', data: [{amount: '', description: ''}]}
        var storedName = 'TM-' + this.date;
        if (localStorage.getItem(storedName) == null) {
          // storing happens here...
          localStorage.setItem(
            storedName, 
            JSON.stringify({
              total: this.amount,
              data: [{
                amount: this.amount, 
                description: this.description
            }]})
          );

          // we keep the total amount persistent so that it could catch possible accumulation
          this.totalAmount = parseInt(this.amount);

          // after storing, we output it on the calendar table
          angular.element('td[data-date="' + this.date + '"] span').html(this.totalAmount);

          // then we clear the fields of the dialog
          $scope.app_dialog.clearDialog();
        }
        else {
          var storedValue = JSON.parse(localStorage.getItem(storedName));
          // get the previous total and sum it up with the latest amount
          storedValue.total = parseInt(storedValue.total) + parseInt(this.amount);

          // populate the data array with a new set of data
          storedValue.data.push({amount: this.amount, description: this.description});

          // we update the localStorage entry
          localStorage.setItem(storedName, JSON.stringify(storedValue));
          this.totalAmount = parseInt(storedValue.total);

          // update the calendar table
          angular.element('td[data-date="' + this.date + '"] span').html(this.totalAmount);

          // clear the dialog fields
          $scope.app_dialog.clearDialog();
        }
      }
  	},
    // function to clear the amount and description
    clearDialog: function() {
      this.amount = '';
      this.description = '';
    }
  };

  /**
   * App Calendar object
   */
  $scope.app_calendar = {
    // retrieve all data associated to a certain date
    // data are stored within the localStorage
    // each data are in a certain formatting e.g. TM-00-00-00
    // the data is being parsed and get the total amount
    // displayed on that particular date
    retrieveData: function() {
      // iterate on each day of the month, that is being displayed on the screen
      for (var i = 0; i < angular.element('.fc-day').length; i++) {
        var date = angular.element('.fc-day').eq(i).attr('data-date');
        var storedName = 'TM-' + date;
        if (localStorage.getItem(storedName)) {
          // retrieve the data
          var storedValue = JSON.parse(localStorage.getItem(storedName));

          // set the total amount of the day from here...
          angular.element('td[data-date="' + date + '"] span').html(storedValue.total);
        } 
      }
    }
  };

  // we're setting some 1 second delay, to make sure that the full calendar is already rendered
  setTimeout($scope.app_calendar.retrieveData, 1000);

}]);