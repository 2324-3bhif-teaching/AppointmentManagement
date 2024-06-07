kubectl delete -n student-f-stroschneider deployment appointmentManagement
kubectl delete -n student-f-stroschneider service appointmentManagement-svc
kubectl delete -n student-f-stroschneider ingress appointmentManagement-ingress
kubectl delete -n student-f-stroschneider pod -l app=appointmentManagement
kubectl create -f leocloud-deploy-V2.yaml