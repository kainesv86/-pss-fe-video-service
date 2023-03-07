import * as React from 'react';
import { Fragment } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { http } from '../../utils/http';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { Booking } from '../../models/booking';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

interface TreatmentModalProps {}

interface TreatmentModalForm {
  level: string;
  note: string;
  name: string;
  symptomIds: string[];
}

interface Treatment {
  id: string;
  name: string;
  level: string;
  note: string;
  status: boolean;
  symptoms: Symptom[];
}

interface Symptom {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
}

const defaultValues: TreatmentModalForm = {
  level: 'LOW',
  note: '',
  name: '',
  symptomIds: [],
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const TreatmentModal: React.FunctionComponent<TreatmentModalProps> = () => {
  const methods = useForm<TreatmentModalForm>({ defaultValues });

  const [open, setOpen] = React.useState(false);

  const [bookingId, setBookingId] = React.useState('');
  const [studentId, setStudentId] = React.useState('');

  const [selectedSymptoms, setSelectedSymptoms] = React.useState<string[]>([]);

  React.useEffect(() => {
    const bookingId = window.location.pathname.split('/')[2];
    setBookingId(bookingId);
  }, []);

  console.log('bookingId', bookingId);

  const handleSubmit = (data: TreatmentModalForm) => {
    const newData = { ...data, bookingId, status: true, symptomIds: selectedSymptoms };
    console.log(newData);
    http
      .post(`/appointment`, newData)
      .then(res => {
        toast.success('Add treatment successfully');
        appointmentQuery.refetch();
        methods.reset();
      })
      .catch(err => {
        toast.error('Something went wrong');
      });
  };

  const query = useQuery<Booking>(
    ['room-info', bookingId],
    async () => {
      const res = await http.get(`/bookings/${bookingId}`);
      setStudentId(res.data.student.id);
      return res.data;
    },
    { initialData: { id: '', cost: 0, student: { id: '' } } as Booking, enabled: Boolean(bookingId) }
  );

  const appointmentQuery = useQuery<{ data: Treatment[]; count: number }>(
    ['appointment', studentId],
    async () => {
      const filter = {
        studentId,
        currentPage: 0,
        pageSize: 4,
      };
      const res = await http.get(`/appointments?${queryString.stringify(filter)}`);
      console.log(res.data);
      return res.data;
    },
    {
      initialData: { data: [], count: 0 },
      enabled: Boolean(studentId),
    }
  );

  const symptomsQuery = useQuery<{ data: Symptom[]; count: number }>(
    ['symptoms'],
    async () => {
      const filter = {
        currentPage: 0,
        pageSize: 1000,
      };
      const res = await http.get(`/symptoms?${queryString.stringify(filter)}`);
      console.log(res.data);
      return res.data;
    },
    {
      initialData: { data: [], count: 0 },
      enabled: Boolean(studentId),
    }
  );

  return (
    <div className="fixed top-0 left-0 h-full w-full">
      <div className="relative">
        <button
          type="button"
          className="rounded-md absolute top-10 right-10 bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open panel</span>
          <Bars3Icon className="h-8 w-8" aria-hidden="true" />
        </button>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <div className="flex items-start justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Treatment Modal
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                          {/* Replace with your content */}
                          <Tab.Group>
                            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                              <Tab
                                className={({ selected }) =>
                                  classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                      ? 'bg-white shadow'
                                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                  )
                                }
                              >
                                Current Treatment
                              </Tab>
                              {appointmentQuery.data.data.map((item, index) => (
                                <Tab
                                  key={`tab-${item.id}`}
                                  className={({ selected }) =>
                                    classNames(
                                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                      selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                    )
                                  }
                                >
                                  {item.name}
                                </Tab>
                              ))}
                            </Tab.List>
                            <Tab.Panels className="mt-2">
                              <Tab.Panel
                                className={classNames(
                                  'rounded-xl bg-white p-3',
                                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                                )}
                              >
                                <form
                                  className="overflow-hidden shadow-lg sm:rounded-md"
                                  onSubmit={methods.handleSubmit(handleSubmit)}
                                >
                                  <div className="bg-white px-4 py-5 sm:p-6">
                                    <div className="grid grid-cols-6 gap-6">
                                      <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                          Name
                                        </label>
                                        <input
                                          {...methods.register('name')}
                                          className="block outline-none w-full border border-gray-900 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                      </div>
                                      <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                          Level
                                        </label>
                                        <select
                                          {...methods.register('level')}
                                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        >
                                          <option value={'LOW'}>Low</option>
                                          <option value={'MEDIUM'}>Medium</option>
                                          <option value={'HIGH'}>High</option>
                                        </select>
                                      </div>
                                      <div className="col-span-12 sm:col-span-6">
                                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                          Symptom
                                        </label>
                                        <Select
                                          onChange={value => setSelectedSymptoms(value.map(item => item.value))}
                                          options={symptomsQuery.data.data.map(item => ({
                                            label: item.name,
                                            value: item.id,
                                          }))}
                                          isMulti
                                          className="basic-multi-select"
                                          classNamePrefix="select"
                                        />
                                      </div>
                                      <div className="sm:col-span-6">
                                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                          Note
                                        </label>
                                        <div className="mt-1">
                                          <textarea
                                            {...methods.register('note')}
                                            rows={20}
                                            className="block outline-none w-full border border-gray-900 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                          />
                                        </div>
                                        <p className="mt-2 text-sm text-gray-500">
                                          Write a few sentences can help student in future
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                                    <button
                                      type="submit"
                                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </form>
                              </Tab.Panel>
                              {appointmentQuery.data.data.map((item, index) => (
                                <Tab.Panel>
                                  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                                        Treatment Information
                                      </h3>
                                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Note of {item.name} treatment
                                      </p>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                                      <dl className="sm:divide-y sm:divide-gray-200">
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                          <dt className="text-sm font-semibold text-gray-900">Level</dt>
                                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {item.level}
                                          </dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                          <dt className="text-sm font-semibold text-gray-900">Symptoms</dt>
                                          <dd className="mt-1 text-sm text-gray-900 flex flex-col sm:col-span-2 sm:mt-0">
                                            {item.symptoms.length
                                              ? item.symptoms.map(item => <span>{item.name}</span>)
                                              : 'Other'}
                                          </dd>
                                        </div>
                                        <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                          <dt className="text-sm font-semibold text-gray-900">Note</dt>
                                          <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                            {item.note}
                                          </dd>
                                        </div>
                                      </dl>
                                    </div>
                                  </div>
                                </Tab.Panel>
                              ))}
                            </Tab.Panels>
                          </Tab.Group>

                          {/* /End replace */}
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </div>
  );
};

export default TreatmentModal;
