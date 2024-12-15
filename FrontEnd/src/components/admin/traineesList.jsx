import "../output.css"; // Adjust the path as needed
import { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/useHTTP";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export function TraineesList() {
  const {
    get: httpGet,
    post,
    loading,
    error,
    del
  } = useHttp("http://localhost:3000");

  const fetchData = async () => {
    try {
      const response = await httpGet("/users/trainees", {
        headers: { "Cache-Control": "no-cache" },
      });
      console.log(response);
      setTrainees(response.data.trainees);
    } catch (err) {
      console.log(err);
    }
  };

  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await del(`/users/${userId}`, {
        headers: { "Cache-Control": "no-cache" },
        body: {},
        data: {},
      });
      console.log(response);
      
      fetchData();
    } catch (err) {
      console.log(err);
    }
  
  }

  const [selectedUser, setSelectedUser] = useState(null);
  const dialogRef = useRef(null);

  const onRowClick = (event) => {
    const user = event.data;
    setSelectedUser(user);

    // Open the dialog
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedUser(null);
  };

  return (
    <div>
      <DataTable
        value={trainees}
        paginator
        rows={10}
        onRowClick={onRowClick}
        dataKey="user_id"
        className="border-accent text-textColor focus-ring-accent"
        rowClassName="hover:bg-secondary hover:bg-opacity-50 border-accent cursor-pointer"
        filter
        filterDisplay="row"
        emptyMessage="No users found."
      >
        <Column
          field="user_id"
          filterField="user_id"
          header="ID"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by ID"
          headerClassName="bg-secondary"
          style={{ minWidth: "220px" }}
        />
        <Column
          field="email"
          filterField="email"
          header="Email"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by email"
          headerClassName="bg-secondary"
          style={{ minWidth: "240px" }}
        />
        <Column
          field="first_name"
          filterField="first_name"
          header="First Name"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by first name"
          headerClassName="bg-secondary"
          style={{ minWidth: "280px" }}
        />
        <Column
          field="last_name"
          filterField="last_name"
          header="Last Name"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by last name"
          headerClassName="bg-secondary"
          style={{ minWidth: "280px" }}
        />
        <Column
          field="phone_number"
          filterField="phone_number"
          header="Phone Number"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by phone number"
          headerClassName="bg-secondary"
          style={{ minWidth: "320px" }}
        />
        <Column
          field="gender"
          filterField="gender"
          header="Gender"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by gender"
          headerClassName="bg-secondary"
          style={{ minWidth: "260px" }}
        />
        <Column
          field="birth_date"
          filterField="birth_date"
          header="Birth Date"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by birth date"
          headerClassName="bg-secondary"
          style={{ minWidth: "280px" }}
        />
        <Column
          field="height"
          filterField="height"
          header="Heigh"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by height"
          headerClassName="bg-secondary"
          style={{ minWidth: "260px" }}
        />
        <Column
          field="weight"
          filterField="weight"
          header="Weight"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by weight"
          headerClassName="bg-secondary"
          style={{ minWidth: "260px" }}
        />
        <Column
          field="food_allergies"
          filterField="food_allergies"
          header="Food Allergies"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by food allergies"
          headerClassName="bg-secondary"
          style={{ minWidth: "300px" }}
        />
        <Column
          field="workout_preferences"
          filterField="workout_preferences"
          header="Workout Preferences"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by workout preferences"
          headerClassName="bg-secondary"
          style={{ minWidth: "360px" }}
        />
        <Column
          field="bio"
          filterField="bio"
          header="BIO"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by BIO"
          headerClassName="bg-secondary"
          style={{ minWidth: "240px" }}
        />
        <Column
          field="photo"
          filterField="photo"
          header="Photo"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by photo"
          headerClassName="bg-secondary"
          style={{ minWidth: "260px" }}
        />
        <Column
          field="coach_id"
          filterField="coach_id"
          header="Coach ID"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by coach ID"
          headerClassName="bg-secondary"
          style={{ minWidth: "300px" }}
        />
        <Column
          field="nutritionist_id"
          filterField="nutritionist_id"
          header="Nutritionist ID"
          filter
          filterMenuClassName="bg-secondary text-textColor"
          filterPlaceholder="Search by nutritionist ID"
          headerClassName="bg-secondary"
          style={{ minWidth: "320px" }}
        />
      </DataTable>

      <dialog
        ref={dialogRef}
        className="p-6 rounded-lg w-full max-w-md bg-textColor text-backGroundColor"
      >
        {selectedUser && (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedUser.first_name} {selectedUser.last_name}
                </h2>
                <p className="py-2 px-4"> {selectedUser.bio}</p>
              </div>
              <button
                onClick={handleCloseModal}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 px-4">
              <div>
                <strong>User ID:</strong> {selectedUser.user_id}
              </div>
              <div>
                <strong>Email:</strong> {selectedUser.email}
              </div>
              <div>
                <strong>Coach ID:</strong> {selectedUser.coach_id}
              </div>
              <div>
                <strong>Nutritionist ID:</strong> {selectedUser.nutritionist_id}
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <button onClick={()=>handleDelete(selectedUser.user_id)} className="border-accent border-2 py-2 px-6 rounded-full hover:bg-accent hover:text-backGroundColor active:ring active:ring-accent/50">
                Delete User
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
