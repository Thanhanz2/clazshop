var app = angular.module('reportApp', ['ngRoute']);

app.controller('reportCtrl', function($scope, $http, $timeout) {
    $scope.revenueChart = null;

	$scope.createChart = function(products, revenues) {
	    $timeout(function() {
	        var ctxRevenue = document.getElementById('revenueChart');
	        if (ctxRevenue) {
	            ctxRevenue = ctxRevenue.getContext('2d');
				if ($scope.revenueChart) {
					                $scope.revenueChart.destroy();
					            }
	            $scope.revenueChart = new Chart(ctxRevenue, {
	                type: 'bar',
	                data: {
	                    labels: products,
	                    datasets: [{
	                        label: 'Tổng sản phẩm đã bán',
	                      	data: revenues,
	                        backgroundColor: products.map((_, index) => {
	                            const colors = [
	                                'rgba(54, 162, 235, 0.6)',
	                                'rgba(255, 99, 132, 0.6)',
	                                'rgba(255, 206, 86, 0.6)',
	                                'rgba(75, 192, 192, 0.6)',
	                                'rgba(153, 102, 255, 0.6)',
	                                'rgba(255, 159, 64, 0.6)'
	                            ];
	                            return colors[index % colors.length];
	                        }),
	                        borderColor: products.map((_, index) => {
	                            const borderColors = [
	                                'rgba(54, 162, 235, 1)',
	                                'rgba(255, 99, 132, 1)',
	                                'rgba(255, 206, 86, 1)',
	                                'rgba(75, 192, 192, 1)',
	                                'rgba(153, 102, 255, 1)',
	                                'rgba(255, 159, 64, 1)'
	                            ];
	                            return borderColors[index % borderColors.length];
	                        }),
	                        borderWidth: 2
	                    }]
	                },
	                options: {
	                    responsive: true,
	                    maintainAspectRatio: false,
	                    scales: {
	                        y: {
	                            beginAtZero: true, 
	                            min: 0, 
								max: Math.max(...revenues) + 7, 
	                            title: {
	                                display: true,
									text: 'Số lượng'
	                            }
	                        },
	                        x: {
	                            title: {
	                                display: true,
	                                text: 'Sản Phẩm'
	                            }
	                        }
	                    }
	                }
	            });
	        } else {
	            console.error("Không tìm thấy phần tử canvas với id 'revenueChart'");
	        }
	    }, 0);
	};
	$scope.createChart([],[]);
	$scope.monthlyRevenueData = [];  
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;

	$scope.fetchProductRevenueData = function(year, month) {
		if (!$scope.selectedYear) {
		        swal({
		            title: "Thông báo!",
		            text: "Vui lòng chọn năm để xem doanh thu.",
		            icon: "warning",
		            button: "Đóng"
		        });
		        return;
		    }

		    if (!$scope.selectedMonth) {
		        swal({
		            title: "Thông báo!",
		            text: "Vui lòng chọn tháng để xem doanh thu.",
		            icon: "warning",
		            button: "Đóng"
		        });
		        return;
		    }
	    $http.get(`/api/revenue/product?year=${year}&month=${month || ''}`)
	        .then(function(response) {
	            if (response.data && response.data.length > 0) {
	                var revenueData = response.data;
	                $scope.monthlyRevenueData = revenueData.map(item => ({
	                    id: item.id,
	                    product: item.product,
	                    revenue: item.totalRevenue
	                }));

	                $scope.totalPages = Math.ceil($scope.monthlyRevenueData.length / $scope.itemsPerPage);
	                $scope.updatePagedData();

	                var products = $scope.monthlyRevenueData.map(item => item.product);
	                var revenues = $scope.monthlyRevenueData.map(item => item.revenue);

	                $scope.createChart(products, revenues);
	            } else {
	                swal({
	                    title: "Thông báo!",
	                    text: `Không có dữ liệu doanh thu cho năm ${year} ${month ? 'và tháng ' + month : ''}.`,
	                    icon: "warning",
	                    button: "Đóng"
	                });

	                $scope.monthlyRevenueData = [];
	                $scope.totalPages = 1;
	                $scope.updatePagedData();
	                $scope.createChart(['Không có dữ liệu'], [0]);
	            }
	        })
	        .catch(function(error) {
	            console.error("Có lỗi xảy ra khi gọi API doanh thu theo sản phẩm: ", error);
	        });
	};

	$scope.updatePagedData = function () {
	    const start = ($scope.currentPage - 1) * $scope.itemsPerPage;
	    $scope.pagedData = $scope.monthlyRevenueData.slice(start, start + $scope.itemsPerPage);
	};

	$scope.nextPage = function () {
	    if ($scope.currentPage < $scope.totalPages) {
	        $scope.currentPage++;
	        $scope.updatePagedData();
	    }
	};

	$scope.previousPage = function () {
	    if ($scope.currentPage > 1) {
	        $scope.currentPage--;
	        $scope.updatePagedData();
	    }
	};
	
    $scope.fetchProductRevenueData();

	$scope.createLineChart = function(months, totalRegistrations) {
	    $timeout(function() {
	        var ctx = document.getElementById('myChart');
	        if (ctx) {
				if ($scope.myChart) {
				$scope.myChart.destroy();
				}
	            ctx = ctx.getContext('2d');

	            var allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
	            var monthNames = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

	            var monthDataMap = allMonths.reduce((acc, month) => {
	                acc[month] = 0;
	                return acc;
	            }, {});

	            months.forEach((month, index) => {
	                if (monthDataMap[month] !== undefined) {
	                    monthDataMap[month] = totalRegistrations[index] !== undefined ? Math.floor(totalRegistrations[index]) : 0; // Làm tròn
	                }
	            });

	            var monthsLabels = allMonths.map(month => monthNames[month - 1]);
	            var registrationsData = allMonths.map(month => monthDataMap[month]);

	            $scope.myChart = new Chart(ctx, {
	                type: 'line',
	                data: {
	                    labels: monthsLabels,
	                    datasets: [{
	                        label: 'Tổng số người dùng đã đăng ký vào năm 2024',
	                        data: registrationsData,
	                        borderColor: 'rgba(75, 192, 192, 1)',
	                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
	                        borderWidth: 2,
	                        fill: true
	                    }]
	                },
	                options: {
	                    responsive: true,
						maintainAspectRatio: false,
	                    scales: {
	                        y: {
	                            beginAtZero: true,
	                            min: 0,
	                            max: Math.max(...registrationsData) + 10, 
	                            title: {
	                                display: true,
	                                text: 'Số lượng người dùng đăng ký'
	                            },
	                            ticks: {
	                                stepSize: 1 
	                            }
	                        },
	                        x: {
	                            title: {
	                                display: true,
	                                text: 'Tháng'
	                            }
	                        }
	                    }
	                }
	            });

	        } else {
	            console.error("Không tìm thấy phần tử canvas với id 'myChart'");
	        }
	    }, 0);
	};
		$scope.createLineChart([],[]);
	
	$scope.monthlyCustomerData=[]
	$scope.fetchMonthlyUserRegistrationsData = function(year) {
	    $http.get(`/api/user/registrations/monthly?year=${year}`)
	        .then(function(response) {
	            if (response.data && response.data.length > 0) {
	                var registrationData = response.data;
	                var months = registrationData.map(item => item.month);
	                var totalRegistrations = registrationData.map(item => item.total); 
	                $scope.createLineChart(months, totalRegistrations); 
					$scope.monthlyCustomerData = registrationData.map(item => ({
					month: item.month,            
					total: item.total    
					 }));
	            } else {
					swal({
					title: "Thông báo!",
					text: "Không có dữ liệu khách hàng tham gia năm này " + year + ".",
					icon: "warning",
					button: "Đóng"
					});
	            }
	        })
	        .catch(function(error) {
	            console.error("Có lỗi xảy ra khi gọi API đăng ký theo : ", error);
	        });
	};
	$scope.fetchMonthlyUserRegistrationsData();
	
	$scope.fetchMonthlyProductRevenueData = function(year) {
	    if (year < 2000 || year > new Date().getFullYear()) {
	        swal({
	            title: "Lỗi!",
	            text: "Vui lòng nhập một năm hợp lệ.",
	            icon: "error",
	            button: "Đóng"
	        });
	        return;
	    }

	    $http.get(`/api/revenue/monthly?year=${year}`)
	    .then(function(response) {
	        const revenueData = response.data || [];
	        console.log("Dữ liệu trả về từ API:", revenueData);

	        if (revenueData.length === 0) {
	            swal({
	                title: "Thông báo!",
	                text: "Không có dữ liệu doanh thu cho năm " + year + ".",
	                icon: "warning",
	                button: "Đóng"
	            });
	            $scope.revenues = Array(12).fill(0); 
	            return;
	        }

	        const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
	        const monthDataMap = allMonths.reduce((acc, month) => {
	            acc[month] = 0; 
	            return acc;
	        }, {});

	        revenueData.forEach(item => {
	            if (item.month >= 1 && item.month <= 12) {
	                monthDataMap[item.month] = item.totalRevenue || 0;
	            } else {
	                console.error("Tháng không hợp lệ:", item.month);
	            }
	        });

	        console.log("Tháng và doanh thu:", monthDataMap);

	        $scope.months = allMonths;
	        $scope.revenues = allMonths.map(month => monthDataMap[month]); 

	        console.log("Dữ liệu tháng và doanh thu sau khi xử lý:", $scope.months, $scope.revenues);
	        $scope.createMonthlyChart($scope.months, $scope.revenues);
	    })
	    .catch(function(error) {
	        console.error("Có lỗi khi gọi API:", error);
	    });
	};


	$scope.createMonthlyChart = function(months = [], revenues = []) {
	    $timeout(function() {
	        var ctxMonthlyRevenue = document.getElementById('monthlyRevenueChart');
	        if (ctxMonthlyRevenue) {
	            ctxMonthlyRevenue = ctxMonthlyRevenue.getContext('2d');
	            if ($scope.monthlyRevenueChart) {
	                $scope.monthlyRevenueChart.destroy();
	            }
	            $scope.monthlyRevenueChart = new Chart(ctxMonthlyRevenue, {
	                type: 'bar',
	                data: {
	                    labels: months.length > 0 ? months.map(month => `Tháng ${month}`) : ['Chưa có dữ liệu'],
	                    datasets: [{
	                        label: 'Doanh thu theo năm',
	                        data: revenues.length > 0 ? revenues : [0],
	                        backgroundColor: months.map((_, index) => {
	                            const colors = [
	                                'rgba(54, 162, 235, 0.6)',
	                                'rgba(255, 99, 132, 0.6)',
	                                'rgba(255, 206, 86, 0.6)',
	                                'rgba(75, 192, 192, 0.6)',
	                                'rgba(153, 102, 255, 0.6)',
	                                'rgba(255, 159, 64, 0.6)'
	                            ];
	                            return colors[index % colors.length];
	                        }),
	                        borderColor: months.map((_, index) => {
	                            const borderColors = [
	                                'rgba(54, 162, 235, 1)',
	                                'rgba(255, 99, 132, 1)',
	                                'rgba(255, 206, 86, 1)',
	                                'rgba(75, 192, 192, 1)',
	                                'rgba(153, 102, 255, 1)',
	                                'rgba(255, 159, 64, 1)'
	                            ];
	                            return borderColors[index % borderColors.length];
	                        }),
	                        borderWidth: 2
	                    }]
	                },
	                options: {
	                    responsive: true,
	                    maintainAspectRatio: false,
	                    scales: {
	                        y: { beginAtZero: true },
	                        x: { beginAtZero: true }
	                    }
	                }
	            });
	        }
	    }, 0);
	};

	$scope.createMonthlyChart();

	$scope.fetchMonthlyProductRevenueData($scope.selectedYear);
	$scope.getYears = function() {
	         let years = [];
	         for (let i = 2020; i <= 2030; i++) {
	             years.push(i);
	         }
	         return years;
	     };
});
