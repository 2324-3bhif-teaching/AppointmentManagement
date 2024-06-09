kubectl.exe delete -n student-a-ignac deployment appointmentManagement
kubectl.exe delete -n student-a-ignac service appointmentManagement-svc
kubectl.exe delete -n student-a-ignac ingress appointmentManagement-ingress
kubectl.exe delete -n student-a-ignac pod -l app=appointmentManagement
kubectl.exe create -f leocloud-deploy-V2.yaml