"use client";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@cap/ui";
import { classNames } from "@cap/utils";
import { Check, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useSharedContext } from "@/app/dashboard/_components/DynamicSharedLayout";
import { Avatar } from "@/app/s/[videoId]/_components/tabs/Activity";
import { NewOrganization } from "@/components/forms/NewOrganization";
import { Tooltip } from "@/components/Tooltip";
import { UsageButton } from "@/components/UsageButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@cap/ui";
import {
  faBuilding,
  faDownload,
  faRecordVinyl,
  faShareNodes,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { motion } from "framer-motion";
import { buildEnv } from "@cap/env";

import { updateActiveOrganization } from "./server";

export const AdminNavItems = ({ collapsed }: { collapsed?: boolean }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { organizationData, activeOrganization, user, isSubscribed } =
    useSharedContext();

  const manageNavigation = [
    {
      name: "My Caps",
      href: `/dashboard/caps`,
      icon: faRecordVinyl,
      subNav: [],
    },
    {
      name: "Shared Caps",
      href: `/dashboard/shared-caps`,
      icon: faShareNodes,
      subNav: [],
    },
    {
      name: "Download App",
      href: `/download`,
      icon: faDownload,
      subNav: [],
    },
    {
      name: "Organization",
      href: `/dashboard/settings/organization`,
      icon: faBuilding,
      subNav: [],
    },
    ...(buildEnv.NEXT_PUBLIC_IS_CAP && user.email.endsWith("@cap.so")
      ? [
          {
            name: "Admin Dev",
            href: "/dashboard/admin",
            icon: faBuilding,
            subNav: [],
          },
        ]
      : []),
  ];

  const navItemClass =
    "flex items-center justify-start py-2 px-3 rounded-2xl outline-none tracking-tight w-full overflow-hidden";

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip
          disable={open || collapsed === false}
          position="right"
          content={
            activeOrganization?.organization.name ?? "No organization found"
          }
        >
          <PopoverTrigger asChild>
            <div
              className={
                "px-3 py-2.5 w-full rounded-xl border cursor-pointer bg-gray-3 border-gray-4"
              }
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                role="combobox"
                aria-expanded={open}
              >
                <div className="flex justify-between items-center w-full text-left">
                  <div className="flex items-center">
                    <Avatar
                      letterClass="text-gray-1 text-xs"
                      className="relative flex-shrink-0 size-5"
                      name={
                        activeOrganization?.organization.name ??
                        "No organization found"
                      }
                    />
                    <p className="ml-2.5 text-sm text-gray-12 font-medium truncate">
                      {activeOrganization?.organization.name ??
                        "No organization found"}
                    </p>
                  </div>
                  {!collapsed && (
                    <ChevronDown className="w-5 h-auto text-gray-8" />
                  )}
                </div>
              </div>
              <PopoverContent
                className={clsx(
                  "p-0 w-[calc(100%-12px)] z-[60]",
                  collapsed ? "ml-3" : "mx-auto"
                )}
              >
                <Command>
                  <CommandInput placeholder="Search organizations..." />
                  <CommandEmpty>No organizations found</CommandEmpty>
                  <CommandGroup>
                    {organizationData?.map((organization) => {
                      const isSelected =
                        activeOrganization?.organization.id ===
                        organization.organization.id;
                      return (
                        <CommandItem
                          key={organization.organization.name + "-organization"}
                          onSelect={async () => {
                            await updateActiveOrganization(
                              organization.organization.id
                            );
                            setOpen(false);
                          }}
                        >
                          {organization.organization.name}
                          <Check
                            size={18}
                            className={classNames(
                              "ml-auto",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                    <DialogTrigger className="mt-3 w-full">
                      <Button
                        variant="dark"
                        size="sm"
                        className="flex gap-1 items-center w-full"
                      >
                        <Plus className="w-4 h-auto" />
                        Add new organization
                      </Button>
                    </DialogTrigger>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </div>
          </PopoverTrigger>
        </Tooltip>
      </Popover>
      <nav
        className="flex flex-col justify-between w-full h-full"
        aria-label="Sidebar"
      >
        <div
          className={clsx("mt-8 space-y-2.5", collapsed ? "items-center" : "")}
        >
          {manageNavigation.map((item) => (
            <div key={item.name} className="flex relative justify-center">
              {pathname.includes(item.href) ? (
                <motion.div
                  initial={{
                    width: collapsed ? 40 : "100%",
                    height: collapsed ? 40 : "100%",
                  }}
                  animate={{
                    width: collapsed ? 40 : "100%",
                    height: collapsed ? 40 : "100%",
                  }}
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.4,
                    width: { type: "tween", duration: 0.05 },
                  }}
                  layoutId="underline"
                  id="underline"
                  className={clsx(
                    "absolute inset-0 mx-auto rounded-xl shadow-sm border-gray-5 text-gray-8 border-[1px] shadow-gray-2"
                  )}
                />
              ) : null}
              <Tooltip
                content={item.name}
                disable={collapsed === false}
                position="right"
              >
                <Link
                  passHref
                  prefetch={false}
                  href={item.href}
                  className={classNames(
                    "relative transition-opacity duration-200 hover:opacity-75 z-3",
                    navItemClass
                  )}
                >
                  <FontAwesomeIcon
                    icon={item.icon as IconDefinition}
                    className={classNames(
                      "flex-shrink-0 w-5 h-5 transition-colors duration-200 stroke-[1.5px]",
                      collapsed ? "text-gray-12" : "text-gray-10"
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-base ml-2.5 text-gray-12 truncate">
                    {item.name}
                  </span>
                </Link>
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="pb-0 w-full lg:pb-5">
          <UsageButton
            collapsed={collapsed ?? false}
            subscribed={isSubscribed}
          />
          <p className="mt-4 text-xs text-center truncate text-gray-10">
            Cap Software, Inc. {new Date().getFullYear()}.
          </p>
        </div>
      </nav>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Organization</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <NewOrganization onOrganizationCreated={() => setDialogOpen(false)} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNavItems;
