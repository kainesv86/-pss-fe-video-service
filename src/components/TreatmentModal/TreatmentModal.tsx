import * as React from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { http } from '../../utils/http';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { Booking } from '../../models/booking';

interface TreatmentModalProps {}

const TreatmentModal: React.FunctionComponent<TreatmentModalProps> = () => {
  const [open, setOpen] = React.useState(false);

  const [level, setLevel] = React.useState('LOW');
  const [note, setNote] = React.useState('');

  const [bookingId, setBookingId] = React.useState('');
  const [studentId, setStudentId] = React.useState('');

  React.useEffect(() => {
    const bookingId = window.location.pathname.split('/')[2];
    setBookingId(bookingId);
  }, []);

  const handleSave = () => {
    http
      .post(`/appointment`, { bookingId, status: true, level, note })
      .then(res => {
        toast.success('Add treatment successfully');
        setLevel('LOW');
        setNote('');
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

  const appointQuery = useQuery(
    ['appointment', studentId],
    async () => {
      const filter = {
        studentId,
        currentPage: 0,
        pageSize: 4,
      };
      const res = await http.get(`/appointments/${studentId}?${JSON.stringify(filter)}`);
      console.log(res.data);
      return res.data;
    },
    {
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
            <div className="fixed inset-0" />

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

                          <div className="overflow-hidden shadow-lg sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                              <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                  <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                                    Level
                                  </label>
                                  <select
                                    id="level"
                                    name="level"
                                    autoComplete="level"
                                    onChange={e => setLevel(e.target.value)}
                                    defaultValue={level}
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  >
                                    <option value={'LOW'}>Low</option>
                                    <option value={'Medium'}>Medium</option>
                                    <option value={'HIGH'}>High</option>
                                  </select>
                                </div>
                                <div className="sm:col-span-6">
                                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                                    Note
                                  </label>
                                  <div className="mt-1">
                                    <textarea
                                      id="note"
                                      name="note"
                                      onChange={e => setNote(e.target.value)}
                                      rows={20}
                                      className="block outline-none w-full border border-gray-900 p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                      defaultValue={note}
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
                                onClick={() => handleSave()}
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              >
                                Save
                              </button>
                            </div>
                          </div>

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
